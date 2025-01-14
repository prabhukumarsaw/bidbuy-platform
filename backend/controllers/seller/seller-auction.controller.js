const auctionService = require('../../services/auction/seller-auction-service');
const ActionLogService = require('../../services/action-log.service');
const logger = require('../../config/logger');
const notificationService = require('../../services/notification/notification.service');
const { AppError } = require('../../middleware/error-handler');
const actionLogService = require('../../services/action-log.service');

class SellerAuctionController {
  async createAuction(req, res) {
    try {
      // Check if required files are provided
      if (!req.files['featuredImage'] || !req.files['images']) {
        return res
          .status(400)
          .json({ message: 'Featured image and other images are required' });
      }

      // Ensure that the required price fields are numbers
      const startingPrice = parseFloat(req.body.startingPrice);
      const minBidIncrement = parseFloat(req.body.minBidIncrement);
      const reservePrice = req.body.reservePrice
        ? parseFloat(req.body.reservePrice)
        : null;

      // Validation for price fields
      if (isNaN(startingPrice) || isNaN(minBidIncrement)) {
        return res.status(400).json({ message: 'Invalid price values' });
      }

      if (reservePrice && isNaN(reservePrice)) {
        return res.status(400).json({ message: 'Invalid reserve price' });
      }

      // Parse tags from JSON string
      let tags = [];
      try {
        tags = JSON.parse(req.body.tags || '[]');
        if (!Array.isArray(tags)) {
          throw new Error('Tags must be an array');
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid tags format' });
      }

      // Prepare auction data
      const auctionData = {
        ...req.body,
        startingPrice,
        minBidIncrement,
        reservePrice,
        featuredImage: req.files['featuredImage'][0].path,
        images: req.files['images'].map((file) => file.path),
        tags,
        sellerId: req.user.seller.id,
        creatorId: req.user.id,
      };

      // Create the auction
      const auction = await auctionService.createAuction(auctionData);

      // Log action and notify users
      await Promise.all([
        ActionLogService.logAction({
          action: 'CREATE_AUCTION',
          description: `Seller created auction: ${auction.title}`,
          userId: req.user.id,
          sellerId: req.user.seller.id,
        }),

        notificationService.createNotification({
          type: 'SYSTEM',
          title: 'New Auction Created',
          message: `A new auction "${auction.title}" has been created`,
          userId: req.user.id,
          auctionId: auction.id,
        }),
      ]);

      // Respond with success
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

      await actionLogService.logAction({
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

      await actionLogService.logAction({
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
      const { status } = req.body;

      // Update the auction status
      const auction = await auctionService.updateAuctionStatus(
        id,
        status,
        req.user.seller.id // Pass the seller ID for authorization
      );

      // Log the action and send notifications
      await Promise.all([
        ActionLogService.logAction({
          action: 'UPDATE_AUCTION_STATUS',
          description: `Updated auction status to ${status}: ${auction.title}`,
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

      // Send success response
      res.json({
        status: 'success',
        data: auction,
      });
    } catch (error) {
      logger.error('Error in updateAuctionStatus:', {
        error: error.message,
        auctionId: req.params.id,
        status: req.body.status,
        sellerId: req.user.seller.id,
      });

      // Send error response
      res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message || 'Failed to update auction status',
      });
    }
  }

  async getAllAuctions(req, res) {
    try {
      const { role, seller } = req.user;

      // Ensure only sellers can access this endpoint
      if (role !== 'SELLER') {
        throw new AppError(403, 'Only sellers can access this endpoint');
      }

      // Extract query parameters
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
      } = req.query;

      // Build the filter object
      const filter = {
        sellerId: seller.id, // Only fetch auctions created by the seller
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
      };

      // Log the filter for debugging
      console.log('Filter:', filter);

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
      const auctions = await auctionService.getAuctions(
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

  async getAuctionById(req, res, next) {
    try {
      const { id } = req.params;
      const { role, seller } = req.user;

      // Fetch the auction by ID
      const auction = await auctionService.getAuctionById(id);

      if (!auction) {
        throw new AppError(404, 'Auction not found');
      }

      // Restrict access: Sellers can only view their own auctions
      if (role === 'SELLER') {
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
      next(new AppError(error.statusCode || 500, error.message));
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
      const auctions = await auctionService.getActiveAuctionsForSeller(
        seller.id
      );

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
      const sellerId = req.user.seller.id; // Get seller ID from authenticated user
      const stats = await auctionService.getSellerDashboardStats(sellerId);
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
