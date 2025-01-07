const auctionService = require('../../services/auction/auction.service');
const ActionLogService = require('../../services/action-log.service');
const logger = require('../../config/logger');
const notificationService = require('../../services/notification/notification.service');
const { AppError } = require('../../middleware/error-handler');

class SellerAuctionController {
  async createAuction(req, res) {
    try {
      const auctionData = {
        ...req.body,
        // ...req.validatedData,
        sellerId: req.user.seller.id,
        creatorId: req.user.id,
      };

      const auction = await auctionService.createAuction(auctionData);

      await Promise.all([
        ActionLogService.logAction({
          action: 'CREATE_AUCTION',
          description: `Admin created auction: ${auction.title}`,
          userId: req.user.id,
          sellerId: req.user.seller.id,
        }),

        // Notify relevant users (e.g., followers of the category)
        await notificationService.createNotification({
          type: 'SYSTEM',
          title: 'New Auction Created',
          message: `A new auction "${auction.title}" has been created`,
          userId: req.user.id,
          auctionId: auction.id,
        }),
      ]);

      res.status(201).json({
        status: 'success',
        data: auction,
      });
    } catch (error) {
      logger.error('Error in createAuction:', error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async updateAuction(req, res) {
    try {
      const { id } = req.params;
      // const updateData = req.body;
      const updateData = req.validatedData;

      const auction = await auctionService.updateAuction(id, updateData);

      await createActionLog({
        action: 'UPDATE_AUCTION',
        description: `updated auction: ${auction.title}`,
        userId: req.user.id,
        sellerId: req.user.seller.id,
      });

      res.json({
        status: 'success',
        data: auction,
      });
    } catch (error) {
      logger.error('Error in updateAuction:', error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async deleteAuction(req, res) {
    try {
      const { id } = req.params;

      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      await auctionService.deleteAuction(id);

      await createActionLog({
        action: 'DELETE_AUCTION',
        description: `deleted auction with ID: ${id}`,
        userId: req.user.id,
        sellerId: req.user.seller.id,
      });

      res.status(204).send();
    } catch (error) {
      logger.error('Error in deleteAuction:', error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async updateAuctionStatus(req, res) {
    try {
      const { id } = req.params;
      // const { status } = req.body;
      const { status } = req.validatedData;

      const auction = await auctionService.updateAuctionStatus(id, status);

      await Promise.all([
        createActionLog({
          action: 'UPDATE_AUCTION_STATUS',
          description: `Admin updated auction status to ${status}: ${auction.title}`,
          userId: req.user.id,
          sellerId: req.user.seller.id,
        }),
        notificationService.createNotification({
          type: 'SYSTEM',
          title: 'Auction Status Updated',
          message: `Auction "${auction.title}" status changed to ${status}`,
          userId: auction.creatorId,
          auctionId: auction.id,
        }),
      ]);

      res.json({
        status: 'success',
        data: auction,
      });
    } catch (error) {
      logger.error('Error in updateAuctionStatus:', error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async getAllAuctions(req, res) {
    try {
      const { role, seller } = req.user;

      // Allow only sellers to fetch their auctions
      const filter = role === 'SELLER' ? { sellerId: seller.id } : {};

      const auctions = await auctionService.getAuctions(filter);

      res.json({
        status: 'success',
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getAllAuctions:', error);
      throw new AppError(500, 'Failed to fetch auctions');
    }
  }

  async getAuctionById(req, res) {
    try {
      const { id } = req.params;
      const { role, seller } = req.user;

      // Fetch the auction by ID
      const auction = await auctionService.getAuctionById(id);

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      // Restrict access: Sellers can only view their own auctions
      if (role === 'SELLER' && auction.sellerId !== seller.id) {
        throw new AppError(
          403,
          'You are not authorized to access this auction'
        );
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

  async getActiveAuctions(req, res) {
    try {
      const { role, seller } = req.user;
  
      // Ensure the request is coming from a seller
      if (role !== 'SELLER') {
        throw new AppError(403, 'Only sellers can access this endpoint');
      }
  
      // Fetch active auctions for the seller
      const auctions = await auctionService.getActiveAuctionsForSeller(seller.id);
  
      res.json({
        status: 'success',
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getActiveAuctions:', error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }
  

  async getDashboardStats(req, res) {
    try {
      const stats = await auctionService.getSellerDashboardStats();
      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getDashboardStats:', error);
      throw new AppError(500, error.message);
    }
  }

  async getAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await auctionService.getSellerAnalytics(
        startDate,
        endDate
      );
      res.json({
        status: 'success',
        data: analytics,
      });
    } catch (error) {
      logger.error('Error in getAnalytics:', error);
      throw new AppError(500, error.message);
    }
  }
}

module.exports = new SellerAuctionController();
