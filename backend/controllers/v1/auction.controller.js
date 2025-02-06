const auctionService = require('../../services/auction/getAuction.service');
const notificationService = require('../../services/notification/notification.service');
const { AppError } = require('../../middleware/error-handler');
const logger = require('../../config/logger');

class AdminAuctionController {
  async getAllAuctions(req, res) {
    try {
      const {
        status,
        categoryId,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
        search,
        minPrice,
        maxPrice,
        startTime,
        endTime,
        sellerName,
        sellerId,
      } = req.query;

      // Build the filter object
      const filter = {
        ...(status &&
          status !== 'all' && { status: { in: status.split(',') } }), // Filter by status if not "all"
        ...(categoryId && categoryId !== 'all' && { categoryId }), // Filter by category if not "all"
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }), // Search by title or description
        ...(minPrice && { currentPrice: { gte: parseFloat(minPrice) } }), // Filter by minimum price
        ...(maxPrice && { currentPrice: { lte: parseFloat(maxPrice) } }), // Filter by maximum price
        ...(startTime && { startTime: { gte: new Date(startTime) } }), // Filter by start time
        ...(endTime && { endTime: { lte: new Date(endTime) } }), // Filter by end time
        ...(sellerName && {
          seller: {
            businessName: { contains: sellerName, mode: 'insensitive' }, // Filter by seller's business name
          },
        }),
        ...(sellerId && { sellerId }),
      };

      // Build the sorting object
      const orderBy = [];
      if (sortBy) {
        sortBy.split(',').forEach((field) => {
          const [fieldName, fieldOrder] = field.split(':');
          orderBy.push({ [fieldName]: fieldOrder || 'asc' });
        });
      } else {
        orderBy.push({ createdAt: 'desc' }); // Default sorting
      }

      // Fetch auctions with pagination
      const auctions = await auctionService.getAllAuctions(
        filter,
        orderBy,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        status: 'success',
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getAllAuctions:', error);
      throw new AppError(500, 'Failed to fetch auctions');
    }
  }

  async getActiveAuctions(req, res) {
    try {
      const auctions = await auctionService.getActiveAuctions();
      res.json({
        status: 'success',
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getActiveAuctions:', error);
      throw new AppError(500, error.message);
    }
  }

  async getAuctionsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const auctions = await auctionService.getAuctionsByCategory(categoryId);
      res.json({
        status: 'success',
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getAuctionsByCategory:', error);
      throw new AppError(500, error.message);
    }
  }

  async getAuctionById(req, res) {
    try {
      const { id } = req.params;
      const auction = await auctionService.getAuctionById(id);

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      res.json({
        status: 'success',
        data: auction,
      });
    } catch (error) {
      logger.error('Error in getAuctionById:', error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async getAuctionBids(req, res) {
    try {
      const { id } = req.params;
      const bids = await auctionService.getAuctionBids(id);
      res.json({
        status: 'success',
        data: bids,
      });
    } catch (error) {
      logger.error('Error in getAuctionBids:', error);
      throw new AppError(500, error.message);
    }
  }
}

module.exports = new AdminAuctionController();
