const redis = require('../config/redis');
const logger = require('../config/logger');

const cache = (options = {}) => {
  const {
    ttl = 3600,
    prefix = 'cache',
    keyGenerator = (req) => `${prefix}:${req.originalUrl}`,
    condition = () => true,
  } = options;

  return async (req, res, next) => {
    if (!condition(req)) {
      return next();
    }

    const cacheKey = keyGenerator(req);

    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json;
      res.json = function (data) {
        redis.setex(cacheKey, ttl, JSON.stringify(data));
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = { cache };
