const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const { AppError } = require('../../middleware/error-handler');
const socketService = require('../../services/socket-service');

class BidService {
  constructor() {
    this.prisma = prisma;
    this.LIVE_BID_CHANNEL = 'live-bids';
  }

  async createBid({ amount, auctionId, bidderId, auction }) {
    // Validate minimum bid increment
    if (amount < auction.currentPrice + auction.minBidIncrement) {
      throw new AppError(
        400,
        `Bid must be at least ${auction.currentPrice + auction.minBidIncrement}`
      );
    }

    // Start transaction to ensure data consistency
    const newBid = await this.prisma.$transaction(async (tx) => {
      // Get latest auction state to prevent race conditions
      const currentAuction = await tx.auction.findUnique({
        where: { id: auctionId },
        select: { currentPrice: true, winnerId: true },
      });

      // Revalidate bid amount with latest price
      if (amount < currentAuction.currentPrice + auction.minBidIncrement) {
        throw new AppError(
          400,
          'Bid amount too low - auction price has updated'
        );
      }

      // Update previous winning bid to OUTBID if exists
      if (currentAuction.currentPrice > 0) {
        await tx.bid.updateMany({
          where: {
            auctionId,
            status: 'WINNING',
          },
          data: {
            status: 'OUTBID',
          },
        });
      }

      // Create new bid
      const bid = await tx.bid.create({
        data: {
          amount,
          auctionId,
          bidderId,
          status: 'WINNING',
          bidHistory: {
            previousPrice: currentAuction.currentPrice,
            bidTime: new Date().toISOString(),
          },
        },
        include: {
          bidder: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update auction current price and winner
      await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: amount,
          winnerId: bidderId,
        },
      });

      return bid;
    });

    // Emit real-time updates
    socketService.emitNewBid(auctionId, {
      id: newBid.id,
      amount: newBid.amount,
      bidder: newBid.bidder,
      timestamp: newBid.createdAt,
    });

    // Notify previous highest bidder
    if (auction.winnerId && auction.winnerId !== bidderId) {
      socketService.emitOutbidNotification(auction.winnerId, auctionId, {
        amount: newBid.amount,
        bidder: newBid.bidder,
      });
    }

    // Invalidate relevant caches
    await this.invalidateBidCache(auctionId);

    return newBid;
  }

  async getAuctionBids(auctionId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const cacheKey = `bids:auction:${auctionId}:${page}:${limit}`;

    try {
      // Try to get from cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const [bids, total] = await Promise.all([
        this.prisma.bid.findMany({
          where: { auctionId },
          include: {
            bidder: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.bid.count({ where: { auctionId } }),
      ]);

      const result = {
        bids,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };

      // Cache the result for 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(result));
      return result;
    } catch (error) {
      logger.error('Error fetching auction bids:', error);
      throw new AppError(500, 'Failed to fetch auction bids');
    }
  }

  async getUserBids(userId, status, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const cacheKey = `bids:user:${userId}:${status}:${page}:${limit}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const where = {
        bidderId: userId,
        ...(status && { status }),
      };

      const [bids, total] = await Promise.all([
        this.prisma.bid.findMany({
          where,
          include: {
            auction: {
              select: {
                id: true,
                title: true,
                endTime: true,
                currentPrice: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.bid.count({ where }),
      ]);

      const result = {
        bids,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };

      await redis.setex(cacheKey, 300, JSON.stringify(result));
      return result;
    } catch (error) {
      logger.error('Error fetching user bids:', error);
      throw new AppError(500, 'Failed to fetch user bids');
    }
  }

  async getBidById(bidId) {
    const cacheKey = `bid:${bidId}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const bid = await this.prisma.bid.findUnique({
        where: { id: bidId },
        include: {
          auction: true,
          bidder: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!bid) {
        throw new AppError(404, 'Bid not found');
      }

      await redis.setex(cacheKey, 300, JSON.stringify(bid));
      return bid;
    } catch (error) {
      logger.error('Error fetching bid:', error);
      throw error instanceof AppError
        ? error
        : new AppError(500, 'Failed to fetch bid');
    }
  }

  async getWinningBid(auctionId) {
    const cacheKey = `bid:winning:${auctionId}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const bid = await this.prisma.bid.findFirst({
        where: {
          auctionId,
          status: 'WINNING',
        },
        include: {
          bidder: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (bid) {
        await redis.setex(cacheKey, 300, JSON.stringify(bid));
      }

      return bid;
    } catch (error) {
      logger.error('Error fetching winning bid:', error);
      throw new AppError(500, 'Failed to fetch winning bid');
    }
  }

  async getUserActiveBids(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const cacheKey = `bids:user:${userId}:active:${page}:${limit}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const where = {
        bidderId: userId,
        status: {
          in: ['PLACED', 'WINNING'],
        },
        auction: {
          status: 'ACTIVE',
        },
      };

      const [bids, total] = await Promise.all([
        this.prisma.bid.findMany({
          where,
          include: {
            auction: {
              select: {
                id: true,
                title: true,
                endTime: true,
                currentPrice: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.bid.count({ where }),
      ]);

      const result = {
        bids,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };

      await redis.setex(cacheKey, 300, JSON.stringify(result));
      return result;
    } catch (error) {
      logger.error('Error fetching active bids:', error);
      throw new AppError(500, 'Failed to fetch active bids');
    }
  }

  async invalidateBidCache(bidId) {
    try {
      const keys = await redis.keys(`bid:${bidId}*`);
      if (keys.length) {
        await redis.del(keys);
      }
    } catch (error) {
      logger.error('Error invalidating bid cache:', error);
    }
  }

  async subscribeToBidUpdates(auctionId, callback) {
    const channel = `${this.LIVE_BID_CHANNEL}:${auctionId}`;

    const subscriber = redis.duplicate();
    await subscriber.subscribe(channel);

    subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });

    return () => {
      subscriber.unsubscribe(channel);
      subscriber.quit();
    };
  }

  async publishBidUpdate(auctionId, bid) {
    const channel = `${this.LIVE_BID_CHANNEL}:${auctionId}`;
    await redis.publish(channel, JSON.stringify(bid));
  }
}

module.exports = new BidService();
