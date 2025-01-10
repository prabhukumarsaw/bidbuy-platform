const { prisma } = require('../config/database');
const { AppError } = require('../middleware/error-handler');
const logger = require('../config/logger');
const emailService = require('./email-service');

class AdminService {
  // User Management
  async getAllUsers() {
    return await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        active: true,
        createdAt: true,
      },
    });
  }

  async deactivateUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { active: false },
    });

    // Send notification email
    await emailService.sendAccountDeactivationEmail(user.email);

    return updatedUser;
  }

  async reactivateUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { active: true },
    });

    // Send notification email
    await emailService.sendAccountReactivationEmail(user.email);

    return updatedUser;
  }

  // Seller Management
  async getAllSellers() {
    return await prisma.seller.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            active: true,
          },
        },
      },
    });
  }

  async getSellerApplications() {
    return await prisma.seller.findMany({
      where: { verified: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async verifySeller(sellerId, verified) {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: { user: true },
    });

    if (!seller) {
      throw new AppError('Seller not found', 404);
    }

    const newStatus = verified ? 'VERIFIED' : 'PENDING';

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        verified,
        status: newStatus,
        verifiedAt: verified ? new Date() : null,
      },
      include: { user: true },
    });

    // Send notification email
    if (verified) {
      await emailService.sendSellerVerificationEmail(seller.user.email);
    }

    // Step 3: If the seller is verified, update their role to "SELLER"
    if (verified) {
      await prisma.user.update({
        where: { id: seller.user.id },
        data: { role: 'SELLER' },
      });
    }

    return updatedSeller;
  }

  async suspendSeller(sellerId, reason) {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: { user: true },
    });

    if (!seller) {
      throw new AppError('Seller not found', 404);
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        suspended: true,
        status: 'SUSPENDED',
        suspendedAt: new Date(),
        suspensionReason: reason,
      },
      include: { user: true },
    });

    // Send notification email
    await emailService.sendSellerSuspensionEmail(seller.user.email, reason);

    return updatedSeller;
  }

  async reactivateSeller(sellerId) {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: { user: true },
    });

    if (!seller) {
      throw new AppError('Seller not found', 404);
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        suspended: false,
        suspendedAt: null,
        suspensionReason: null,
        status: 'VERIFIED',
      },
      include: { user: true },
    });

    // Send notification email
    await emailService.sendSellerReactivationEmail(seller.user.email);

    return updatedSeller;
  }

  // Statistics and Analytics
  async getUserStats() {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { active: true } });
    const inactiveUsers = await prisma.user.count({ where: { active: false } });
    const verifiedUsers = await prisma.user.count({
      where: { emailVerified: true },
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      verified: verifiedUsers,
      byRole: usersByRole,
      newToday: newUsersToday,
    };
  }

  async getSellerStats() {
    const totalSellers = await prisma.seller.count();
    const verifiedSellers = await prisma.seller.count({
      where: { verified: true },
    });
    const pendingSellers = await prisma.seller.count({
      where: { verified: false },
    });
    const suspendedSellers = await prisma.seller.count({
      where: { suspended: true },
    });

    const newSellersToday = await prisma.seller.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return {
      total: totalSellers,
      verified: verifiedSellers,
      pending: pendingSellers,
      suspended: suspendedSellers,
      newToday: newSellersToday,
    };
  }

  async getDashboardStats() {
    const [userStats, sellerStats] = await Promise.all([
      this.getUserStats(),
      this.getSellerStats(),
    ]);

    return {
      users: userStats,
      sellers: sellerStats,
    };
  }
}

module.exports = {
  adminService: new AdminService(),
};
