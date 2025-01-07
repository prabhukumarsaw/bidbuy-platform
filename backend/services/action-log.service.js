const { prisma } = require('../config/database');
const logger = require('../config/logger');

class ActionLogService {
  async logAction(data) {
    try {
      return await prisma.actionLog.create({
        data,
      });
    } catch (error) {
      logger.error('Error logging action:', error);
      throw error;
    }
  }

  async getUserActions(userId) {
    try {
      return await prisma.actionLog.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error fetching user actions:', error);
      throw error;
    }
  }

  async getSellerActions(sellerId) {
    try {
      return await prisma.actionLog.findMany({
        where: { sellerId },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      logger.error('Error fetching seller actions:', error);
      throw error;
    }
  }
}

module.exports = new ActionLogService();
