const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');
const notificationService = require('./notification.service');

const prisma = new PrismaClient();

class ReportService {
  async createReport(data) {
    try {
      const report = await prisma.report.create({
        data,
        include: {
          auction: true,
          reporter: true
        }
      });

      // Notify admins
      await notificationService.createNotification({
        type: 'SYSTEM',
        title: 'New Report Filed',
        message: `A new report has been filed for auction ${report.auction.title}`,
        userId: report.reporterId // This should be admin's ID in production
      });

      return report;
    } catch (error) {
      logger.error('Error creating report:', error);
      throw error;
    }
  }

  async updateReportStatus(id, status, adminId) {
    try {
      const report = await prisma.report.update({
        where: { id },
        data: { status },
        include: {
          reporter: true,
          auction: true
        }
      });

      // Notify reporter of status change
      await notificationService.createNotification({
        type: 'SYSTEM',
        title: 'Report Status Updated',
        message: `Your report for auction ${report.auction.title} has been ${status.toLowerCase()}`,
        userId: report.reporterId
      });

      return report;
    } catch (error) {
      logger.error('Error updating report status:', error);
      throw error;
    }
  }

  async getReportsByStatus(status) {
    try {
      return await prisma.report.findMany({
        where: { status },
        include: {
          auction: true,
          reporter: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      logger.error('Error fetching reports:', error);
      throw error;
    }
  }
}

module.exports = new ReportService();