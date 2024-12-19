import redis from '../config/redis.js';

export const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }
      
      res.originalJson = res.json;
      res.json = (body) => {
        redis.setex(key, duration, JSON.stringify(body));
        return res.originalJson(body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};
