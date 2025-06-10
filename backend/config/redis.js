const Redis = require('ioredis');
const logger = require('./logger');

let redis;

if (process.env.REDIS_URL) {
  // If REDIS_URL is provided (like redis://red-d141fei4d50c73efdv50:6379)
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      logger.warn(`Redis reconnecting attempt #${times}, retrying in ${delay}ms`);
      return delay;
    },
  });
} else {
  // Fall back to individual environment variables
  redis = new Redis({
    host: process.env.REDISHOST,
    port: parseInt(process.env.REDISPORT),
    password: process.env.REDISPASSWORD || null,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      logger.warn(`Redis reconnecting attempt #${times}, retrying in ${delay}ms`);
      return delay;
    },
  });
}

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

module.exports = redis;
