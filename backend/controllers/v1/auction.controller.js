const auctionService = require('../../services/auction/getAuction.service');
const notificationService = require('../../services/notification/notification.service');
const { AppError } = require('../../middleware/error-handler');
const logger = require('../../config/logger');

class AdminAuctionController {
  async getAllAuctions(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt:desc',
        status,
        categoryId,
        userId,
        minPrice,
        maxPrice,
        search,
      } = req.query;

      const filters = {
        status,
        categoryId,
        userId,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        search,
      };

      const result = await auctionService.getAllAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        filters,
      });

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Error in getAllAuctions:', error);
      throw new AppError(500, error.message);
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
