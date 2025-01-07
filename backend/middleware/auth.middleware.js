const jwt = require('jsonwebtoken');
const { AppError } = require('./error-handler');
const { prisma } = require('../config/database');
const redis = require('../config/redis');
const logger = require('../config/logger');

const TOKEN_PREFIX = 'token:';
const BLACKLIST_PREFIX = 'blacklist:';

const protect = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    if (!token) {
      return next(new AppError('Authentication required', 401));
    }

    // Check token blacklist
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(new AppError('Token has been revoked', 401));
    }

    const decoded = verifyToken(token);
    const user = await getUserWithPermissions(decoded.id);

    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new AppError('Authentication failed', 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    // For seller routes, ensure seller is verified
    if (roles.includes('SELLER') && !req.user.seller?.verified) {
      return next(new AppError('Seller account not verified', 403));
    }

    next();
  };
};

// Helper functions
const extractTokenFromHeader = (req) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

const isTokenBlacklisted = async (token) => {
  return await redis.get(`${BLACKLIST_PREFIX}${token}`);
};

const getUserWithPermissions = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      seller: {
        select: {
          id: true,
          verified: true,
        },
      },
    },
  });
};

module.exports = { protect, restrictTo };
