const { Worker } = require('bullmq');
const redis = require('./redis'); // Import the Redis client
const auctionService = require('../services/auction/seller-auction-service'); // Import auction service
const ActionLogService = require('../services/action-log.service'); // Import action log service
const notificationService = require('../services/notification/notification.service'); // Import notification service

// Initialize the worker
const worker = new Worker(
  'auctionTransitions',
  async (job) => {
    const { auctionId, status, userId, sellerId, creatorId, title } = job.data;

    try {
      // Update the auction status
      const auction = await auctionService.updateAuctionStatus(
        auctionId,
        status,
        sellerId // Pass the seller ID for authorization
      );

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

      console.log(`Successfully updated auction ${auctionId} to ${status}`);
      return { status: 'success', data: auction };
    } catch (error) {
      console.error(
        `Failed to update auction ${auctionId} to ${status}:`,
        error
      );
      throw error; // Ensure the job is marked as failed
    }
  },
  { connection: redis } // Use the Redis client directly
);

// Worker event listeners
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

module.exports = worker;
