const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const { AppError } = require('../../middleware/error-handler');

class AuctionService {
  async getAllAuctions(filter, orderBy, page, limit) {
    try {
      const skip = (page - 1) * limit;

      // Remove the status filter if it's set to "all"
      const cleanedFilter = { ...filter };
      if (
        cleanedFilter.status &&
        cleanedFilter.status.in &&
        cleanedFilter.status.in.includes('all')
      ) {
        delete cleanedFilter.status;
      }

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

  async getActiveAuctions() {
    try {
      const cacheKey = 'auctions:active';
      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const auctions = await prisma.auction.findMany({
        where: {
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
      logger.error('Error fetching active auctions:', error);
      throw new AppError(500, 'Failed to fetch active auctions');
    }
  }

  async getAuctionsByCategory(categoryId) {
    try {
      const cacheKey = `auctions:category:${categoryId}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const auctions = await prisma.auction.findMany({
        where: {
          categoryId,
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

      await redis.setex(cacheKey, 300, JSON.stringify(auctions));
      return auctions;
    } catch (error) {
      logger.error('Error fetching category auctions:', error);
      throw new AppError(500, 'Failed to fetch category auctions');
    }
  }

  async invalidateCategoryCache(categoryId) {
    try {
      await redis.del(`auctions:category:${categoryId}`);
    } catch (error) {
      logger.error('Error invalidating category cache:', error);
    }
  }

  async getAuctionById(id) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
        include: {
          user: true,
          category: true,
          bids: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { bidder: true },
          },
          _count: {
            select: { bids: true },
          },
        },
      });

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      // Increment views
      await prisma.auction.update({
        where: { id },
        data: { views: { increment: 1 } },
      });

      return auction;
    } catch (error) {
      logger.error('Error fetching auction:', error);
      throw error;
    }
  }

  async validateAuctionForBidding(id) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
        include: {
          bids: {
            orderBy: { amount: 'desc' },
            take: 1,
          },
        },
      });

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      // Check if auction is active
      if (auction.status !== 'ACTIVE') {
        throw new AppError(400, 'Auction is not active');
      }

      // Check if auction has ended
      if (new Date() > new Date(auction.endTime)) {
        throw new AppError(400, 'Auction has ended');
      }

      // Check if auction has started
      if (new Date() < new Date(auction.startTime)) {
        throw new AppError(400, 'Auction has not started yet');
      }

      return {
        ...auction,
        currentPrice: auction.currentPrice || auction.startingPrice,
        minBidIncrement: auction.minBidIncrement || 1, // Default increment if not set
      };
    } catch (error) {
      logger.error('Error validating auction:', error);
      throw error instanceof AppError
        ? error
        : new AppError(500, 'Failed to validate auction');
    }
  }
}

module.exports = new AuctionService();
