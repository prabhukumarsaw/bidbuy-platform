const { PrismaClient } = require('@prisma/client');
const redis = require('../config/redis');
const logger = require('../config/logger');
const notificationService = require('./notification.service');
const { calculateNextMinimumBid } = require('../utils/auction.utils');

const prisma = new PrismaClient();

class BidService {
  async placeBid(auctionId, userId, amount) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
          bids: {
            orderBy: { amount: 'desc' },
            take: 1,
          },
        },
      });

      if (!auction) throw new Error('Auction not found');
      if (auction.status !== 'ACTIVE') throw new Error('Auction is not active');
      if (auction.endTime < new Date()) throw new Error('Auction has ended');
      if (auction.sellerId === userId)
        throw new Error('Sellers cannot bid on their own auctions');

      const minNextBid = calculateNextMinimumBid(
        auction.currentPrice,
        auction.minBidIncrement
      );
      if (amount < minNextBid) {
        throw new Error(`Bid amount must be at least ${minNextBid}`);
      }

      const bid = await prisma.$transaction(async (prisma) => {
        // Update previous winning bid
        if (auction.bids[0]) {
          await prisma.bid.update({
            where: { id: auction.bids[0].id },
            data: { status: 'OUTBID' },
          });

          // Notify previous highest bidder
          await notificationService.createNotification({
            type: 'BID_OUTBID',
            userId: auction.bids[0].bidderId,
            auctionId,
            title: 'You have been outbid!',
            message: `Someone has placed a higher bid on ${auction.title}`,
          });
        }

        // Create new bid
        const newBid = await prisma.bid.create({
          data: {
            amount,
            auctionId,
            bidderId: userId,
            status: 'WINNING',
          },
        });

        // Update auction current price
        await prisma.auction.update({
          where: { id: auctionId },
          data: { currentPrice: amount },
        });

        // Notify seller
        await notificationService.createNotification({
          type: 'BID_PLACED',
          userId: auction.sellerId,
          auctionId,
          title: 'New Bid Placed',
          message: `A new bid of ${amount} has been placed on your auction`,
        });

        return newBid;
      });

      await redis.del(`auction:${auctionId}`);
      return bid;
    } catch (error) {
      logger.error('Error placing bid:', error);
      throw error;
    }
  }

  async getUserBids(userId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    try {
      const where = { bidderId: userId };
      if (status) where.status = status;

      const [bids, total] = await prisma.$transaction([
        prisma.bid.findMany({
          where,
          include: {
            auction: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.bid.count({ where }),
      ]);

      return {
        bids,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
        },
      };
    } catch (error) {
      logger.error('Error fetching user bids:', error);
      throw error;
    }
  }

  async getWinningBids(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    try {
      const where = {
        bidderId: userId,
        status: 'WINNING',
      };

      const [bids, total] = await prisma.$transaction([
        prisma.bid.findMany({
          where,
          include: {
            auction: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.bid.count({ where }),
      ]);

      return {
        bids,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
        },
      };
    } catch (error) {
      logger.error('Error fetching winning bids:', error);
      throw error;
    }
  }
}

module.exports = new BidService();
