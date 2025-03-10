const { prisma } = require('../../config/database');
const { AppError } = require('../../middleware/error-handler');
const logger = require('../../config/logger');
const { profileImageUpload } = require('../../middleware/upload');

exports.getUserProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      mobile: true,
      address: true,
      bio: true,
      role: true,
      createdAt: true,
      emailVerified: true,
      active: true,
    },
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
};

exports.updateUserProfile = async (req, res) => {
  // Handle file upload
  profileImageUpload(req, res, async (err) => {
    if (err) {
      throw new AppError('Error uploading image: ' + err.message, 400);
    }

    const { name, email, mobile, bio, address } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        mobile,
        bio,
        address,
        ...(imageUrl && { image: imageUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        mobile: true,
        address: true,
        bio: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        active: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  });
};

exports.getUserBids = async (req, res) => {
  const bids = await prisma.bid.findMany({
    where: { bidderId: req.user.id },
    include: {
      auction: {
        select: {
          id: true,
          title: true,
          currentPrice: true,
          endTime: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({
    status: 'success',
    data: bids,
  });
};
// exports.getUserNotifications = async (req, res) => {
//   const notifications = await prisma.notification.findMany({
//     where: { userId: req.user.id },
//     orderBy: { createdAt: 'desc' },
//   });
//   res.status(200).json({
//     status: 'success',
//     data: notifications,
//   });
// };

exports.getUserNotifications = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Unauthorized access' });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch only notifications belonging to the logged-in user
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(skip),
    });

    const totalCount = await prisma.notification.count({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      status: 'success',
      data: notifications,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(new AppError('Failed to fetch notifications', 500));
  }
};

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Unauthorized access' });
    }

    const { id } = req.params;

    // Check if the notification belongs to the logged-in user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== req.user.id) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Notification not found' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.status(200).json({
      status: 'success',
      data: updatedNotification,
    });
  } catch (error) {
    next(new AppError('Failed to mark notification as read', 500));
  }
};

// exports.markNotificationAsRead = async (req, res) => {
//   const notification = await prisma.notification.update({
//     where: {
//       id: req.params.id,
//       userId: req.user.id,
//     },
//     data: { read: true },
//   });
//   res.status(200).json({
//     status: 'success',
//     data: notification,
//   });
// };
exports.getUserInbox = async (req, res) => {
  const messages = await prisma.inboxMessage.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({
    status: 'success',
    data: messages,
  });
};
exports.markMessageAsRead = async (req, res) => {
  const message = await prisma.inboxMessage.update({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    data: { read: true },
  });
  res.status(200).json({
    status: 'success',
    data: message,
  });
};

exports.getUserActionLogs = async (req, res) => {
  const logs = await prisma.actionLog.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({
    status: 'success',
    data: logs,
  });
};
