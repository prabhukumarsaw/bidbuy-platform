const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('../config/redis');
const logger = require('../config/logger');

const createLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    keyPrefix = 'ratelimit',
    message = 'Too many requests, please try again later',
    statusCode = 429,
  } = options;

  return rateLimit({
    store: new RedisStore({
      sendCommand: redis.sendCommand.bind(redis), // Provide sendCommand function
      prefix: keyPrefix,
      resetExpiryOnChange: true,
    }),
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(statusCode).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
    keyGenerator: (req) => {
      return req.user
        ? `${keyPrefix}:user:${req.user.id}`
        : `${keyPrefix}:ip:${req.ip}`;
    },
  });
};

// Specific limiters
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyPrefix: 'ratelimit:auth',
  message: 'Too many authentication attempts',
});

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyPrefix: 'ratelimit:api',
});

module.exports = {
  authLimiter,
  apiLimiter,
  createLimiter,
};
