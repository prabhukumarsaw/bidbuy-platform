const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const { AppError } = require('../../middleware/error-handler');

class AuctionService {
  async getAllAuctions({ page, limit, sort, filters }) {
    try {
      const { status, categoryId, userId, minPrice, maxPrice, search } =
        filters;

      // Parse sort field and direction
      const [sortField, sortDirection] = sort.split(':');

      // Build filter conditions
      const where = {
        ...(status && { status }),
        ...(categoryId && { categoryId }),
        ...(userId && { userId }),
        ...(minPrice && { currentPrice: { gte: minPrice } }),
        ...(maxPrice && { currentPrice: { lte: maxPrice } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Fetch auctions with total count
      const [auctions, totalCount] = await Promise.all([
        prisma.auction.findMany({
          where,
          take: limit,
          skip,
          orderBy: { [sortField]: sortDirection.toLowerCase() },
          include: {
            user: true,
            category: true,
            _count: {
              select: { bids: true },
            },
          },
        }),
        prisma.auction.count({ where }),
      ]);

      return {
        items: auctions,
        pagination: {
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          perPage: limit,
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

      // Cache for 5 minutes
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
}

module.exports = new AuctionService();
