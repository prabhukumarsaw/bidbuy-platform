const { Queue } = require('bullmq');
const redis = require('../config/redis'); // Import the Redis client

// Initialize the queue
const auctionQueue = new Queue('auctionTransitions', {
  connection: redis, // Use the Redis client directly
});

module.exports = auctionQueue;
