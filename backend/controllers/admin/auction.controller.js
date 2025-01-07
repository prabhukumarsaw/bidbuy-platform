const auctionService = require('../../services/auction/auction.service');
const ActionLogService = require('../../services/action-log.service');
const logger = require('../../config/logger');
const notificationService = require('../../services/notification/notification.service');
const { AppError } = require('../../middleware/error-handler');

class AdminAuctionController {
  async createAuction(req, res) {
    try {
      const auctionData = {
        ...req.body,
        // ...req.validatedData,
        creatorId: req.user.id,
      };

      const auction = await auctionService.createAuction(auctionData);

      await Promise.all([
        ActionLogService.logAction({
          action: 'CREATE_AUCTION',
          description: `Admin created auction: ${auction.title}`,
          userId: req.user.id,
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
        description: `Admin updated auction: ${auction.title}`,
        userId: req.user.id,
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
        description: `Admin deleted auction with ID: ${id}`,
        userId: req.user.id,
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

  async getDashboardStats(req, res) {
    try {
      const stats = await auctionService.getAdminDashboardStats();
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
      const analytics = await auctionService.getAdminAnalytics(
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

module.exports = new AdminAuctionController();
