const socketIO = require('socket.io');
const logger = require('../config/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.auctionRooms = new Map();
    this.EVENTS = {
      JOIN: 'joinAuction',
      LEAVE: 'leaveAuction',
      DISCONNECT: 'disconnect',
      NEW_BID: 'newBid',
      AUCTION_UPDATE: 'auctionUpdate',
      PARTICIPANTS_COUNT: 'participantsCount',
      TIME_REMAINING: 'timeRemaining',
      OUTBID: 'outbid',
    };
  }

  initialize(server) {
    if (this.io) {
      logger.warn('Socket service already initialized');
      return this.io;
    }

    try {
      this.io = socketIO(server, {
        cors: {
          origin: process.env.FRONTEND_URL || '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      this.setupSocketHandlers();
      logger.info('Socket service initialized successfully');
      return this.io;
    } catch (error) {
      logger.error('Failed to initialize socket service:', error);
      throw error;
    }
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Auction room management
      socket.on(this.EVENTS.JOIN, (auctionId) => {
        this.handleJoinAuction(socket, auctionId);
      });

      socket.on(this.EVENTS.LEAVE, (auctionId) => {
        this.handleLeaveAuction(socket, auctionId);
      });

      socket.on(this.EVENTS.DISCONNECT, () => {
        this.handleDisconnect(socket);
      });

      // Error handling
      socket.on('error', (error) => {
        logger.error(`Socket error for client ${socket.id}:`, error);
      });
    });

    this.io.on('error', (error) => {
      logger.error('Socket.IO server error:', error);
    });
  }

  handleJoinAuction(socket, auctionId) {
    try {
      if (!auctionId) {
        logger.warn(`Invalid auction ID provided by client ${socket.id}`);
        return;
      }

      const room = `auction:${auctionId}`;
      socket.join(room);

      if (!this.auctionRooms.has(auctionId)) {
        this.auctionRooms.set(auctionId, new Set());
      }
      this.auctionRooms.get(auctionId).add(socket.id);

      this.emitParticipantsCount(auctionId);
      logger.info(`Client ${socket.id} joined auction ${auctionId}`);
    } catch (error) {
      logger.error(
        `Error joining auction room for client ${socket.id}:`,
        error
      );
    }
  }

  handleLeaveAuction(socket, auctionId) {
    try {
      if (!auctionId) {
        logger.warn(`Invalid auction ID provided by client ${socket.id}`);
        return;
      }

      const room = `auction:${auctionId}`;
      socket.leave(room);

      if (this.auctionRooms.has(auctionId)) {
        this.auctionRooms.get(auctionId).delete(socket.id);
        if (this.auctionRooms.get(auctionId).size === 0) {
          this.auctionRooms.delete(auctionId);
        }
      }

      this.emitParticipantsCount(auctionId);
      logger.info(`Client ${socket.id} left auction ${auctionId}`);
    } catch (error) {
      logger.error(
        `Error leaving auction room for client ${socket.id}:`,
        error
      );
    }
  }

  handleDisconnect(socket) {
    try {
      this.auctionRooms.forEach((participants, auctionId) => {
        if (participants.has(socket.id)) {
          participants.delete(socket.id);
          this.emitParticipantsCount(auctionId);
        }
      });

      logger.info(`Client disconnected: ${socket.id}`);
    } catch (error) {
      logger.error(`Error handling disconnect for client ${socket.id}:`, error);
    }
  }

  emitParticipantsCount(auctionId) {
    if (!this.isInitialized()) return;

    try {
      const count = this.auctionRooms.get(auctionId)?.size || 0;
      this.io.to(`auction:${auctionId}`).emit(this.EVENTS.PARTICIPANTS_COUNT, {
        count,
        auctionId,
      });
    } catch (error) {
      logger.error(
        `Error emitting participants count for auction ${auctionId}:`,
        error
      );
    }
  }

  emitNewBid(auctionId, bid) {
    if (!this.isInitialized()) return;

    try {
      this.io.to(`auction:${auctionId}`).emit(this.EVENTS.NEW_BID, {
        ...bid,
        auctionId,
        timestamp: new Date().toISOString(),
      });
      logger.debug(`New bid emitted for auction ${auctionId}:`, bid);
    } catch (error) {
      logger.error(`Error emitting new bid for auction ${auctionId}:`, error);
    }
  }

  emitAuctionUpdate(auctionId, update) {
    if (!this.isInitialized()) return;

    try {
      this.io.to(`auction:${auctionId}`).emit(this.EVENTS.AUCTION_UPDATE, {
        ...update,
        auctionId,
        timestamp: new Date().toISOString(),
      });
      logger.debug(`Auction update emitted for auction ${auctionId}`);
    } catch (error) {
      logger.error(
        `Error emitting auction update for auction ${auctionId}:`,
        error
      );
    }
  }

  emitTimeRemaining(auctionId, timeRemaining) {
    if (!this.isInitialized()) return;

    try {
      this.io.to(`auction:${auctionId}`).emit(this.EVENTS.TIME_REMAINING, {
        timeRemaining,
        auctionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(
        `Error emitting time remaining for auction ${auctionId}:`,
        error
      );
    }
  }

  emitOutbidNotification(userId, auctionId, newBid) {
    if (!this.isInitialized()) return;

    try {
      this.io.to(`user:${userId}`).emit(this.EVENTS.OUTBID, {
        auctionId,
        newBid,
        message: 'You have been outbid!',
        timestamp: new Date().toISOString(),
      });
      logger.debug(
        `Outbid notification emitted to user ${userId} for auction ${auctionId}`
      );
    } catch (error) {
      logger.error(
        `Error emitting outbid notification to user ${userId}:`,
        error
      );
    }
  }

  isInitialized() {
    const initialized = !!this.io;
    if (!initialized) {
      logger.warn('Attempted to use socket service before initialization');
    }
    return initialized;
  }

  getRoomParticipants(auctionId) {
    return this.auctionRooms.get(auctionId)?.size || 0;
  }

  disconnectAll() {
    if (this.isInitialized()) {
      this.io.disconnectSockets(true);
      this.auctionRooms.clear();
      logger.info('All socket connections closed');
    }
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
module.exports = socketService;
