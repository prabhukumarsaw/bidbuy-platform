const { prisma } = require('../../config/database');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const { ApiError } = require('../../middleware/error-handler');

class NotificationService {
  async createNotification(data) {
    try {
      const notification = await prisma.notification.create({
        data: {
          ...data,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      await this.invalidateUserNotificationCache(data.userId);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw new ApiError(500, 'Failed to create notification');
    }
  }

  async getUserNotifications(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const cacheKey = `notifications:user:${userId}:${page}:${limit}:${unreadOnly}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const where = {
        userId,
        expiresAt: { gt: new Date() },
      };

      if (unreadOnly) {
        where.read = false;
      }

      const [notifications, total] = await prisma.$transaction([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            auction: {
              select: {
                id: true,
                title: true,
                currentPrice: true,
              },
            },
          },
        }),
        prisma.notification.count({ where }),
      ]);

      const result = {
        notifications,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
        },
      };

      await redis.setex(cacheKey, 300, JSON.stringify(result)); // Cache for 5 minutes
      return result;
    } catch (error) {
      logger.error('Error fetching notifications:', error);
      throw new ApiError(500, 'Failed to fetch notifications');
    }
  }

  async markAsRead(id, userId) {
    try {
      const notification = await prisma.notification.update({
        where: { id, userId },
        data: { read: true },
      });

      await this.invalidateUserNotificationCache(userId);
      return notification;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw new ApiError(400, 'Failed to update notification');
    }
  }

  async markAllAsRead(userId) {
    try {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });

      await this.invalidateUserNotificationCache(userId);
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw new ApiError(500, 'Failed to update notifications');
    }
  }

  async deleteNotification(id, userId) {
    try {
      await prisma.notification.delete({
        where: { id, userId },
      });

      await this.invalidateUserNotificationCache(userId);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw new ApiError(400, 'Failed to delete notification');
    }
  }

  async invalidateUserNotificationCache(userId) {
    try {
      const keys = await redis.keys(`notifications:user:${userId}:*`);
      if (keys.length) {
        await redis.del(keys);
      }
    } catch (error) {
      logger.error('Error invalidating notification cache:', error);
    }
  }
}

module.exports = new NotificationService();
