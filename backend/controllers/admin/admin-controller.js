const { prisma } = require('../../config/database');
const { AppError } = require('../../middleware/error-handler');

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerApplications = async (req, res, next) => {
  try {
    const sellers = await prisma.seller.findMany({
      where: { verified: false },
      include: { user: true },
    });

    res.status(200).json({
      status: 'success',
      data: sellers,
    });
  } catch (error) {
    next(error);
  }
};

const verifySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { verified } = req.body;

    // Step 1: Fetch the seller to ensure the seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        user: true, // Include user details to change their role
      },
    });

    if (!seller) {
      return next(new AppError('Seller not found', 404));
    }

    // Step 2: Update the seller's verification status
    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: { verified },
    });

    // Step 3: If the seller is verified, update their role to "SELLER"
    if (verified) {
      await prisma.user.update({
        where: { id: seller.user.id },
        data: { role: 'SELLER' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedSeller,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getSellerApplications,
  verifySeller,
};
