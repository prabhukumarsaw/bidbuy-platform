const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const { calculateNextMinimumBid } = require('../../utils/auction.utils');
const { AppError } = require('../../middleware/error-handler');
const auctionQueue = require('../scheduler');

class AuctionService {
  // async createAuction(auctionData) {
  //   try {
  //     const auction = await prisma.auction.create({
  //       data: {
  //         title: auctionData.title,
  //         description: auctionData.description,
  //         startingPrice: auctionData.startingPrice,
  //         minBidIncrement: auctionData.minBidIncrement || 1,
  //         reservePrice: auctionData.reservePrice,
  //         startTime: new Date(auctionData.startTime),
  //         endTime: new Date(auctionData.endTime),
  //         categoryId: auctionData.categoryId,
  //         tags: auctionData.tags || [],
  //         featuredImage: auctionData.featuredImage,
  //         images: auctionData.images,
  //         creatorId: auctionData.creatorId,
  //         currentPrice: auctionData.startingPrice,
  //         status: 'DRAFT',
  //       },
  //       include: {
  //         category: true,
  //         user: true,
  //       },
  //     });

  //     // Schedule events if the auction is SCHEDULED
  //     if (auctionData.status === 'SCHEDULED') {
  //       await this.scheduleAuctionEvents(auction);
  //     }

  //     return auction;
  //   } catch (error) {
  //     logger.error('Error in createAuction service:', error);
  //     throw new Error('Failed to create auction');
  //   }
  // }

  async createAuction(auctionData) {
    try {
      // Determine initial status based on start time
      const startTime = new Date(auctionData.startTime);
      const endTime = new Date(auctionData.endTime);
      const now = new Date();

      // Validate times
      if (startTime >= endTime) {
        throw new AppError(400, 'Start time must be before end time');
      }

      // Determine initial status
      let initialStatus = 'DRAFT';
      if (auctionData.startTime && auctionData.endTime) {
        if (startTime <= now && now < endTime) {
          initialStatus = 'ACTIVE';
        } else if (startTime > now) {
          initialStatus = 'SCHEDULED';
        }
      }

      const auction = await prisma.auction.create({
        data: {
          title: auctionData.title,
          description: auctionData.description,
          startingPrice: auctionData.startingPrice,
          minBidIncrement: auctionData.minBidIncrement || 1,
          reservePrice: auctionData.reservePrice,
          startTime: startTime,
          endTime: endTime,
          categoryId: auctionData.categoryId,
          tags: auctionData.tags || [],
          featuredImage: auctionData.featuredImage,
          images: auctionData.images,
          creatorId: auctionData.creatorId,
          currentPrice: auctionData.startingPrice,
          status: initialStatus,
        },
        include: {
          category: true,
          user: true,
        },
      });

      // Schedule events if the auction is SCHEDULED
      if (initialStatus === 'SCHEDULED') {
        await this.scheduleAuctionEvents(auction);
        await auctionQueue.add(
          'update-auction-status',
          {
            auctionId: auction.id,
            startTime: auctionData.startTime,
          },
          {
            delay: new Date(auctionData.startTime) - Date.now(), // Delay job until the start time
          }
        );
      }

      return auction;
    } catch (error) {
      logger.error('Error in createAuction service:', error);
      throw new Error('Failed to create auction');
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

      // Reschedule events if the auction is SCHEDULED
      if (updatedAuction.status === 'SCHEDULED') {
        await this.scheduleAuctionEvents(updatedAuction);
      }

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

  async getAuctions(filter, orderBy, page, limit) {
    try {
      const skip = (page - 1) * limit;

      // Remove the status filter if it's set to "all"
      const cleanedFilter = { ...filter };
      if (
        cleanedFilter.status &&
        cleanedFilter.status.in &&
        cleanedFilter.status.in.includes('all')
      ) {
        delete cleanedFilter.status; // Remove the status filter
      }

      // Log the cleaned filter for debugging
      console.log('Cleaned Filter:', cleanedFilter);

      // Fetch auctions with the applied filter, sorting, and pagination
      const auctions = await prisma.auction.findMany({
        where: cleanedFilter,
        include: {
          category: true,
          bids: {
            select: {
              id: true,
              amount: true,
              bidder: { select: { id: true, name: true } },
            },
            orderBy: { amount: 'desc' },
            take: 1,
          },
          Seller: true,
          _count: {
            select: {
              bids: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      });

      // Log the fetched auctions for debugging
      console.log('Fetched Auctions:', auctions);

      // Transform the response
      const transformedAuctions = auctions.map((auction) => ({
        id: auction.id,
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        currentPrice: auction.currentPrice,
        status: auction.status,
        startTime: auction.startTime,
        endTime: auction.endTime,
        featuredImage: auction.featuredImage,
        images: auction.images,
        category: auction.category,
        highestBid: auction.bids.length > 0 ? auction.bids[0] : null,
        totalBids: auction._count.bids,
        totalViews: auction._count.views,
        seller: auction.Seller,
      }));

      // Get the total count of auctions for pagination
      const totalAuctions = await prisma.auction.count({
        where: cleanedFilter,
      });

      return {
        auctions: transformedAuctions,
        pagination: {
          total: totalAuctions,
          page,
          limit,
          totalPages: Math.ceil(totalAuctions / limit),
          nextPage: page < Math.ceil(totalAuctions / limit) ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      };
    } catch (error) {
      logger.error('Error fetching auctions:', error);
      throw new AppError(500, 'Failed to fetch auctions');
    }
  }

  async getAuctionById(id) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id }, // Ensure the auction belongs to the seller
        include: {
          category: true, // Include category details
          bids: {
            // Include bid details
            select: {
              id: true,
              amount: true,
              bidder: { select: { id: true, name: true } },
            },
            orderBy: { amount: 'desc' }, // Sort bids by amount (highest first)
            take: 1, // Only include the highest bid
          },
          Seller: true, // Include seller details
          _count: {
            // Include counts for bids and views
            select: {
              bids: true,
              // views: true,
            },
          },
        },
      });

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      // Transform the response to include additional details
      return {
        id: auction.id,
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        currentPrice: auction.currentPrice,
        status: auction.status,
        startTime: auction.startTime,
        endTime: auction.endTime,
        featuredImage: auction.featuredImage,
        images: auction.images,
        category: auction.category,
        highestBid: auction.bids.length > 0 ? auction.bids[0] : null, // Include the highest bid
        totalBids: auction._count.bids, // Include the total number of bids
        totalViews: auction._count.views, // Include the total number of views
        seller: auction.Seller,
      };
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

  async updateAuctionStatus(id, status) {
    try {
      console.log(`Updating auction status. ID: ${id}, Status: ${status}`);

      const auction = await prisma.auction.findUnique({
        where: { id },
      });

      if (!auction) {
        throw new AppError(
          404,
          'Auction not found or you are not authorized to update it'
        );
      }

      if (auction.status === status) {
        throw new AppError(400, `Auction is already in status: ${status}`);
      }

      // Validate the status transition
      this.validateStatusTransition(auction.status, status);

      // Additional validation for SCHEDULED status
      if (status === 'SCHEDULED') {
        const now = new Date();
        const startTime = new Date(auction.startTime);
        const endTime = new Date(auction.endTime);

        // Ensure all required fields are present
        if (
          !auction.title ||
          !auction.description ||
          !auction.startingPrice ||
          !auction.startTime ||
          !auction.endTime ||
          !auction.categoryId ||
          !auction.featuredImage ||
          auction.images.length === 0
        ) {
          throw new AppError(
            400,
            'All required fields must be filled before scheduling'
          );
        }

        // Validate times
        if (startTime <= now) {
          throw new AppError(
            400,
            'Cannot schedule an auction with a start time in the past'
          );
        }

        if (startTime >= endTime) {
          throw new AppError(400, 'Start time must be before end time');
        }
      }

      // Update the auction status
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

      // Invalidate cache
      await this.invalidateAuctionCaches(updatedAuction.categoryId);

      return updatedAuction;
    } catch (error) {
      logger.error('Error updating auction status:', error);
      throw error;
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

    // Additional validation for time-based transitions
    if (newStatus === 'SCHEDULED') {
      const now = new Date();
      const startTime = new Date(this.startTime);
      const endTime = new Date(this.endTime);

      if (!startTime || !endTime) {
        throw new AppError(
          400,
          'Start time and end time must be set to schedule an auction'
        );
      }

      if (startTime <= now) {
        throw new AppError(
          400,
          'Cannot schedule an auction with a start time in the past'
        );
      }

      if (startTime >= endTime) {
        throw new AppError(400, 'Start time must be before end time');
      }
    }

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
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
      default:
        logger.warn(`No specific handler for status: ${newStatus}`);
    }
  }

  async scheduleAuctionEvents(auction) {
    try {
      const { id, startTime, endTime } = auction;

      // Schedule transition to ACTIVE at startTime
      const delayToStart = new Date(startTime) - Date.now();
      if (delayToStart > 0) {
        await auctionQueue.add(
          'startAuction',
          { auctionId: id, status: 'ACTIVE' },
          { delay: delayToStart }
        );
      }

      // Schedule transition to ENDED at endTime
      const delayToEnd = new Date(endTime) - Date.now();
      if (delayToEnd > 0) {
        await auctionQueue.add(
          'endAuction',
          { auctionId: id, status: 'ENDED' },
          { delay: delayToEnd }
        );
      }

      logger.info(`Scheduled events for auction: ${auction.id}`);
    } catch (error) {
      logger.error('Error scheduling auction events:', error);
      throw error;
    }
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

    await actionLogService.logAction({
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
    logger.info(`Handling sold auction: ${auction.id}`);
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
      ActionLogService.logAction({
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

  async getAnalytics(startDate, endDate) {
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

      // Corrected groupBy query
      const categoryStats = await prisma.auction.groupBy({
        by: ['categoryId'],
        where,
        _count: {
          categoryId: true, // Count the number of auctions per category
        },
        orderBy: {
          _count: {
            categoryId: 'desc', // Order by the count of auctions in each category
          },
        },
        take: 5, // Limit to top 5 categories
      });

      return {
        totalAuctions,
        activeAuctions,
        completedAuctions,
        totalBids,
        totalRevenue: totalRevenue._sum.currentPrice || 0,
        topCategories: categoryStats.map((stat) => ({
          categoryId: stat.categoryId,
          count: stat._count.categoryId,
        })),
      };
    } catch (error) {
      logger.error('Error getting seller analytics:', error);
      throw new AppError(500, 'Failed to fetch analytics');
    }
  }

  async getDashboardStats() {
    try {
      logger.info('Fetching dashboard stats...');
      // Fetch basic stats
      const [
        totalAuctions,
        activeAuctions,
        completedAuctions,
        totalBids,
        totalRevenue,
      ] = await Promise.all([
        prisma.auction.count(),
        prisma.auction.count({
          where: { status: 'ACTIVE', endTime: { gt: new Date() } },
        }),
        prisma.auction.count({
          where: { status: 'SOLD' },
        }),
        prisma.bid.count(),
        prisma.auction.aggregate({
          where: { status: 'SOLD' },
          _sum: { currentPrice: true },
        }),
      ]);

      // Fetch top categories
      const topCategories = await prisma.auction.groupBy({
        by: ['categoryId'],
        _count: { categoryId: true },
        orderBy: { _count: { categoryId: 'desc' } },
        take: 5,
      });

      // Fetch recent auctions (last 5 created or updated)
      const recentAuctions = await prisma.auction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          category: true,
          bids: { select: { id: true } },
        },
      });

      // Calculate performance metrics
      const averageBidsPerAuction =
        totalAuctions > 0 ? totalBids / totalAuctions : 0;
      const averageRevenuePerAuction =
        totalAuctions > 0
          ? (totalRevenue._sum.currentPrice || 0) / totalAuctions
          : 0;

      return {
        totalAuctions,
        activeAuctions,
        completedAuctions,
        totalBids,
        totalRevenue: totalRevenue._sum.currentPrice || 0,
        topCategories: topCategories.map((cat) => ({
          categoryId: cat.categoryId,
          count: cat._count.categoryId,
        })),
        recentAuctions: recentAuctions.map((auction) => ({
          id: auction.id,
          title: auction.title,
          status: auction.status,
          bids: auction.bids.length,
          category: auction.category.name,
          createdAt: auction.createdAt,
        })),
        performanceMetrics: {
          averageBidsPerAuction: parseFloat(averageBidsPerAuction.toFixed(2)),
          averageRevenuePerAuction: parseFloat(
            averageRevenuePerAuction.toFixed(2)
          ),
        },
      };
    } catch (error) {
      logger.error('Error in getDashboardStats:', error);
      throw new AppError(500, 'Failed to fetch dashboard stats');
    }
  }
}

module.exports = new AuctionService();
