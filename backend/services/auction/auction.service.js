const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const { calculateNextMinimumBid } = require('../../utils/auction.utils');
const { AppError } = require('../../middleware/error-handler');

class AuctionService {
  async createAuction(data) {
    try {
      const auction = await prisma.$transaction(async (prisma) => {
        // Validate category exists
        // const category = await prisma.category.findUnique({
        //   where: { id: data.categoryId },
        // });

        // if (!category) {
        //   throw new AppError(400, 'Invalid category');
        // }

        // Create the auction
        const auction = await prisma.auction.create({
          data: {
            ...data,
            currentPrice: data.startingPrice,
            status: 'DRAFT',
            auctionState: 'RUNNING',
          },
          include: {
            category: true,
            user: true,
            Seller: true,
          },
        });

        return auction;
      });

      // Schedule auction events
      if (auction.status === 'SCHEDULED') {
        await this.scheduleAuctionEvents(auction);
      }

      // Invalidate relevant caches
      await this.invalidateAuctionCaches(auction.categoryId);

      return auction;
    } catch (error) {
      logger.error('Error creating auction:', error);
      throw error;
    }
  }

  async invalidateCategoryCache(categoryId) {
    try {
      await redis.del(`auctions:category:${categoryId}`);
    } catch (error) {
      logger.error('Error invalidating category cache:', error);
    }
  }

  async updateAuction(id, data) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
      });

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      if (auction.status !== 'DRAFT' && auction.status !== 'SCHEDULED') {
        throw new AppError(400, 'Cannot update active or completed auction');
      }

      const updatedAuction = await prisma.auction.update({
        where: { id },
        data,
        include: {
          category: true,
          user: true,
        },
      });

      await this.invalidateAuctionCaches(updatedAuction.categoryId);
      return updatedAuction;
    } catch (error) {
      logger.error('Error updating auction:', error);
      throw error;
    }
  }

  async deleteAuction(id) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
      });

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      if (auction.status === 'ACTIVE' || auction.status === 'SOLD') {
        throw new AppError(400, 'Cannot delete active or completed auction');
      }

      await prisma.auction.delete({
        where: { id },
      });

      await this.invalidateAuctionCaches(auction.categoryId);
    } catch (error) {
      logger.error('Error deleting auction:', error);
      throw error;
    }
  }

  async updateAuctionStatus(id, status) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
      });

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      // Validate status transition
      this.validateStatusTransition(auction.status, status);

      const updatedAuction = await prisma.auction.update({
        where: { id },
        data: { status },
        include: {
          category: true,
          user: true,
        },
      });

      // Handle status-specific actions
      await this.handleStatusChange(updatedAuction, status);

      await this.invalidateAuctionCaches(updatedAuction.categoryId);
      return updatedAuction;
    } catch (error) {
      logger.error('Error updating auction status:', error);
      throw error;
    }
  }

  async getAuctions(filter) {
    try {
      const auctions = await prisma.auction.findMany({
        where: {
          ...filter,
        },
        include: {
          category: true,
          user: true,
          Seller: true,
        },
      });

      return auctions;
    } catch (error) {
      logger.error('Error fetching auctions:', error);
      throw new AppError(500, 'Failed to fetch auctions');
    }
  }

  async getAuctionById(id) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
        include: {
          category: true,
          user: true,
          Seller: true,
        },
      });

      return auction;
    } catch (error) {
      logger.error('Error fetching auction by ID:', error);
      throw new AppError(500, 'Failed to fetch auction');
    }
  }

  async getActiveAuctionsForSeller(sellerId) {
    try {
      const cacheKey = `auctions:active:seller:${sellerId}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const auctions = await prisma.auction.findMany({
        where: {
          sellerId,
          status: 'ACTIVE',
          endTime: { gt: new Date() },
        },
        include: {
          user: true,
          category: true,
          _count: {
            select: { bids: true },
          },
        },
        orderBy: { endTime: 'asc' },
      });

      await redis.setex(cacheKey, 300, JSON.stringify(auctions)); // Cache for 5 minutes
      return auctions;
    } catch (error) {
      logger.error('Error fetching active auctions for seller:', error);
      throw new AppError(500, 'Failed to fetch active auctions for seller');
    }
  }

  validateStatusTransition(currentStatus, newStatus) {
    const allowedTransitions = {
      DRAFT: ['SCHEDULED', 'CANCELLED'],
      SCHEDULED: ['ACTIVE', 'CANCELLED'],
      ACTIVE: ['ENDED', 'CANCELLED'],
      ENDED: ['SOLD', 'CANCELLED'],
      CANCELLED: [],
      SOLD: [],
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(
        400,
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  async handleStatusChange(auction, newStatus) {
    switch (newStatus) {
      case 'ACTIVE':
        await this.scheduleAuctionEvents(auction);
        break;
      case 'ENDED':
        await this.handleAuctionEnd(auction);
        break;
      case 'SOLD':
        await this.handleAuctionSold(auction);
        break;
      case 'CANCELLED':
        await this.handleAuctionCancelled(auction);
        break;
    }
  }

  async scheduleAuctionEvents(auction) {
    // Implementation for scheduling auction events
    // This would typically involve setting up timers or scheduled jobs
    // for auction start and end times
  }

  async handleAuctionEnd(auction) {
    const winningBid = await prisma.bid.findFirst({
      where: { auctionId: auction.id },
      orderBy: { amount: 'desc' },
      include: { bidder: true },
    });

    if (winningBid) {
      await Promise.all([
        // Update auction with winner
        prisma.auction.update({
          where: { id: auction.id },
          data: {
            winnerId: winningBid.bidderId,
            status: 'SOLD',
          },
        }),
        // Update winning bid status
        prisma.bid.update({
          where: { id: winningBid.id },
          data: { status: 'WON' },
        }),
        // Notify winner
        notificationService.createNotification({
          type: 'AUCTION_WON',
          userId: winningBid.bidderId,
          auctionId: auction.id,
          title: 'Congratulations! You Won!',
          message: `You won the auction "${auction.title}" with a bid of $${winningBid.amount}`,
        }),
        // Notify seller
        notificationService.createNotification({
          type: 'AUCTION_SOLD',
          userId: auction.creatorId,
          auctionId: auction.id,
          title: 'Auction Sold',
          message: `Your auction "${auction.title}" was sold for $${winningBid.amount}`,
        }),
      ]);
    }

    await createActionLog({
      action: 'END_AUCTION',
      description: `Ended auction: ${auction.title}`,
      userId: auction.creatorId,
      sellerId: auction.sellerId,
    });
  }

  async handleAuctionSold(auction) {
    // Implementation for handling auction sold status
    // This would typically involve payment processing
    // and sending notifications to winner and seller
  }

  async handleAuctionCancelled(auction) {
    // Notify all bidders
    const bidders = await prisma.bid.findMany({
      where: { auctionId: auction.id },
      select: { bidderId: true },
      distinct: ['bidderId'],
    });

    await Promise.all([
      // Notify all bidders
      ...bidders.map(({ bidderId }) =>
        notificationService.createNotification({
          type: 'SYSTEM',
          userId: bidderId,
          auctionId: auction.id,
          title: 'Auction Cancelled',
          message: `The auction "${auction.title}" has been cancelled`,
        })
      ),
      // Create action log
      createActionLog({
        action: 'CANCEL_AUCTION',
        description: `Cancelled auction: ${auction.title}`,
        userId: auction.creatorId,
        sellerId: auction.sellerId,
      }),
    ]);
  }

  async invalidateAuctionCaches(categoryId) {
    try {
      const keys = [
        'auctions:active',
        `auctions:category:${categoryId}`,
        'auctions:featured',
      ];
      await Promise.all(keys.map((key) => redis.del(key)));
    } catch (error) {
      logger.error('Error invalidating auction caches:', error);
    }
  }

  async getAdminAnalytics(startDate, endDate) {
    try {
      const where = {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      };

      const [
        totalAuctions,
        activeAuctions,
        completedAuctions,
        totalBids,
        totalRevenue,
      ] = await Promise.all([
        prisma.auction.count({ where }),
        prisma.auction.count({ where: { ...where, status: 'ACTIVE' } }),
        prisma.auction.count({ where: { ...where, status: 'SOLD' } }),
        prisma.bid.count({ where }),
        prisma.auction.aggregate({
          where: { ...where, status: 'SOLD' },
          _sum: { currentPrice: true },
        }),
      ]);

      const categoryStats = await prisma.auction.groupBy({
        by: ['categoryId'],
        where,
        _count: true,
        orderBy: {
          _count: {
            _all: 'desc',
          },
        },
        take: 5,
      });

      return {
        totalAuctions,
        activeAuctions,
        completedAuctions,
        totalBids,
        totalRevenue: totalRevenue._sum.currentPrice || 0,
        topCategories: categoryStats,
      };
    } catch (error) {
      logger.error('Error getting admin analytics:', error);
      throw new AppError(500, 'Failed to fetch analytics');
    }
  }
}

module.exports = new AuctionService();
