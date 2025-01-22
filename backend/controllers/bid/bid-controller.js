const BidService = require('../../services/bid/bid-service');
const NotificationService = require('../../services/notification/notification.service');
const AuctionService = require('../../services/auction/getAuction.service');
const socketService = require('../../services/socket-service');
const logger = require('../../config/logger');
const { AppError } = require('../../middleware/error-handler');

class BidController {
  constructor() {
    this.bidService = BidService;
    this.notificationService = NotificationService;
    this.auctionService = AuctionService;
  }

  testData = async (req, res) => {
    try {
      res.status(200).json({ message: 'Test API is working!' });
    } catch (error) {
      logger.error('Test API error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  placeBid = async (req, res) => {
    try {
      const { auctionId } = req.params;
      const { amount } = req.body;

      // Validate user authentication
      if (!req.user?.id) {
        throw new AppError(401, 'Authentication required');
      }
      const bidderId = req.user.id;

      // Validate required fields
      if (!amount || amount <= 0) {
        throw new AppError(400, 'Valid bid amount is required');
      }
      if (!auctionId) {
        throw new AppError(400, 'Auction ID is required');
      }

      // Validate auction status and bid amount
      const auction = await this.auctionService.validateAuctionForBidding(
        auctionId
      );

      // Prevent bidding on own auction
      if (auction.creatorId === bidderId) {
        throw new AppError(400, 'Cannot bid on your own auction');
      }

      // Validate minimum bid increment
      if (
        auction.currentPrice &&
        amount < auction.currentPrice + auction.minBidIncrement
      ) {
        throw new AppError(
          400,
          `Minimum bid must be ${
            auction.currentPrice + auction.minBidIncrement
          }`
        );
      }

      // Place bid and handle notifications
      const bid = await this.bidService.createBid({
        amount,
        auctionId,
        bidderId,
        auction,
      });

      // Create notification for outbid user
      if (
        auction.currentPrice > 0 &&
        auction.winnerId &&
        auction.winnerId !== bidderId
      ) {
        await this.notificationService.create({
          type: 'BID_OUTBID',
          title: 'You have been outbid!',
          message: `Someone has placed a higher bid of ${amount} on ${auction.title}`,
          userId: auction.winnerId,
          auctionId,
        });
      }

      // Emit real-time updates
      socketService.emitAuctionUpdate(auctionId, {
        currentPrice: amount,
        lastBid: {
          id: bid.id,
          amount,
          bidder: {
            id: bidderId,
            name: req.user.name,
          },
          timestamp: new Date(),
        },
      });

      res.status(201).json({
        success: true,
        data: bid,
        message: 'Bid placed successfully',
      });
    } catch (error) {
      logger.error('Place bid error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };

  getAuctionBids = async (req, res) => {
    try {
      const { auctionId } = req.params;
      const { page = 1, limit = 10, sort = 'desc' } = req.query;

      if (!auctionId) {
        throw new AppError(400, 'Auction ID is required');
      }

      const bids = await this.bidService.getAuctionBids(
        auctionId,
        Number(page),
        Number(limit),
        sort
      );

      res.json({
        success: true,
        data: bids,
        message: 'Auction bids retrieved successfully',
      });
    } catch (error) {
      logger.error('Get auction bids error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };

  getUserBids = async (req, res) => {
    try {
      // Validate user authentication
      if (!req.user?.id) {
        throw new AppError(401, 'Authentication required');
      }

      const { status, page = 1, limit = 10 } = req.query;
      const userId = req.user.id;

      const bids = await this.bidService.getUserBids(
        userId,
        status,
        Number(page),
        Number(limit)
      );

      res.json({
        success: true,
        data: bids,
        message: 'User bids retrieved successfully',
      });
    } catch (error) {
      logger.error('Get user bids error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };

  getBidById = async (req, res) => {
    try {
      const { bidId } = req.params;

      if (!bidId) {
        throw new AppError(400, 'Bid ID is required');
      }

      const bid = await this.bidService.getBidById(bidId);

      if (!bid) {
        throw new AppError(404, 'Bid not found');
      }

      res.json({
        success: true,
        data: bid,
        message: 'Bid retrieved successfully',
      });
    } catch (error) {
      logger.error('Get bid error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };

  getWinningBid = async (req, res) => {
    try {
      const { auctionId } = req.params;

      if (!auctionId) {
        throw new AppError(400, 'Auction ID is required');
      }

      const winningBid = await this.bidService.getWinningBid(auctionId);

      res.json({
        success: true,
        data: winningBid,
        message: 'Winning bid retrieved successfully',
      });
    } catch (error) {
      logger.error('Get winning bid error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };

  getUserActiveBids = async (req, res) => {
    try {
      // Validate user authentication
      if (!req.user?.id) {
        throw new AppError(401, 'Authentication required');
      }

      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const activeBids = await this.bidService.getUserActiveBids(
        userId,
        Number(page),
        Number(limit)
      );

      res.json({
        success: true,
        data: activeBids,
        message: 'Active bids retrieved successfully',
      });
    } catch (error) {
      logger.error('Get active bids error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };

  handleWebSocket = (socket) => {
    // Validate socket authentication
    if (!socket.user?.id) {
      socket.emit('error', {
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const { auctionId } = socket.handshake.query;

    if (!auctionId) {
      socket.emit('error', {
        success: false,
        message: 'Auction ID is required',
      });
      return;
    }

    // Join auction room
    socket.join(`auction:${auctionId}`);

    // Handle bid placement through WebSocket
    socket.on('placeBid', async (data) => {
      try {
        const { amount } = data;
        const userId = socket.user.id;

        if (!amount || amount <= 0) {
          throw new AppError(400, 'Valid bid amount is required');
        }

        const auction = await this.auctionService.validateAuctionForBidding(
          auctionId
        );

        if (auction.creatorId === userId) {
          throw new AppError(400, 'Cannot bid on your own auction');
        }

        const bid = await this.bidService.createBid({
          amount,
          auctionId,
          bidderId: userId,
          auction,
        });

        // Emit to all clients in the auction room
        socket.to(`auction:${auctionId}`).emit('newBid', {
          success: true,
          data: bid,
        });
      } catch (error) {
        logger.error('WebSocket bid error:', error);
        socket.emit('bidError', {
          success: false,
          message:
            error instanceof AppError ? error.message : 'Failed to place bid',
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      socket.leave(`auction:${auctionId}`);
      logger.info(`Client disconnected from auction ${auctionId}`);
    });
  };
}

module.exports = BidController;
