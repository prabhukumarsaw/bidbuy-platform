const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');
const redis = require('../config/redis');

const prisma = new PrismaClient();

class InboxService {
  async sendMessage(data) {
    try {
      const message = await prisma.inboxMessage.create({
        data,
      });

      await redis.del(`inbox:user:${data.userId}`);
      return message;
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  async getUserMessages(userId) {
    try {
      const cacheKey = `inbox:user:${userId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const messages = await prisma.inboxMessage.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
      });

      await redis.setex(cacheKey, 3600, JSON.stringify(messages));
      return messages;
    } catch (error) {
      logger.error('Error fetching messages:', error);
      throw error;
    }
  }

  async markMessageAsRead(id, userId) {
    try {
      const message = await prisma.inboxMessage.update({
        where: {
          id,
          userId,
        },
        data: {
          read: true,
        },
      });

      await redis.del(`inbox:user:${userId}`);
      return message;
    } catch (error) {
      logger.error('Error marking message as read:', error);
      throw error;
    }
  }
}

module.exports = new InboxService();
