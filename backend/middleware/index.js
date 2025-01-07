const { protect, restrictTo } = require('./auth.middleware');
const { cache } = require('./cache');
// const {
//   authLimiter,
//   apiLimiter,
//   createRateLimiter,
// } = require('./rate-limiter');
const { validate, validateQuery } = require('./validate');
const { AppError, errorHandler } = require('./error-handler');

module.exports = {
  protect,
  restrictTo,
  cache,
  // authLimiter,
  // apiLimiter,
  // createRateLimiter,
  validate,
  validateQuery,
  AppError,
  errorHandler,
};
