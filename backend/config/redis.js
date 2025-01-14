const Redis = require('ioredis');
const logger = require('./logger');

// Configure Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Default to 'localhost' if no REDIS_HOST is specified
  port: parseInt(process.env.REDIS_PORT || '6379'), // Default to port 6379 if no REDIS_PORT is specified
  maxRetriesPerRequest: null, // Ensure this is set to null for BullMQ
  retryStrategy: (times) => {
    // Gradually increase the retry delay with each attempt, up to a max of 2 seconds
    const delay = Math.min(times * 50, 2000);
    logger.warn(`Redis reconnecting attempt #${times}, retrying in ${delay}ms`);
    return delay;
  },
});

// Log Redis connection events
redis.on('connect', () => {
  logger.info('Connected to Redis server');
});

redis.on('ready', () => {
  logger.info('Redis server is ready');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('end', () => {
  logger.info('Redis connection ended');
});

module.exports = redis; // Export the Redis client directly
