const { Queue, Worker } = require('bullmq');
const ActionLogService = require('../services/action-log.service');
const notificationService = require('../services/notification/notification.service');
const logger = require('./logger');
const { prisma } = require('./database');
const redis = require('./redis');

// Redis connection configuration
const connection = {
  connection: redis,
};
// Initialize the queue
const auctionQueue = new Queue('auctionTransitions', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Create a worker to process jobs
const worker = new Worker(
  'auctionTransitions',
  async (job) => {
    const { auctionId, status, userId, sellerId, creatorId, title } = job.data;

    try {
      logger.info(
        `Processing status update for auction ${auctionId} to ${status}`
      );

      // Update the auction status
      const auction = await prisma.auction.update({
        where: { id: auctionId },
        data: { status },
      });

      // Log the action and send notifications
      await Promise.all([
        ActionLogService.logAction({
          action: 'UPDATE_AUCTION_STATUS',
          description: `Updated auction status to ${status}: ${title}`,
          userId: userId,
          sellerId: sellerId,
        }),
        notificationService.createNotification({
          type: 'SYSTEM',
          title: 'Auction Status Updated',
          message: `Auction "${title}" status changed to ${status}`,
          userId: creatorId,
          auctionId: auctionId,
        }),
      ]);

      logger.info(
        `Successfully updated auction ${auctionId} status to ${status}`
      );
      return { status: 'success', data: auction };
    } catch (error) {
      logger.error(
        `Error processing auction ${auctionId} status update to ${status}:`,
        error
      );
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

// Worker event listeners
worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, error) => {
  logger.error(`Job ${job.id} failed:`, error);
});

worker.on('error', (error) => {
  logger.error('Worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await worker.close();
  await auctionQueue.close();
});

module.exports = {
  auctionQueue,
  worker,
};
