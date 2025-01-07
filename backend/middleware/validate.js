const { AppError } = require('./error-handler');
const logger = require('../config/logger');

const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : req.body;
      const result = await schema.safeParseAsync(data);

      if (!result.success) {
        const errors = formatZodErrors(result.error);
        throw new AppError('Validation failed', 400, errors);
      }

      // Store validated data
      if (source === 'query') {
        req.validatedQuery = result.data;
      } else {
        req.validatedData = result.data;
      }

      next();
    } catch (error) {
      logger.error('Validation error:', error);
      next(error);
    }
  };
};

const formatZodErrors = (error) => {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
};

module.exports = { validate };
