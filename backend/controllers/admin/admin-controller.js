const { adminService } = require('../../services/admin-service');

// User Management Controllers
exports.getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await adminService.deactivateUser(userId);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await adminService.reactivateUser(userId);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Seller Management Controllers
exports.getAllSellers = async (req, res, next) => {
  try {
    const sellers = await adminService.getAllSellers();
    res.status(200).json({
      status: 'success',
      data: sellers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSellerApplications = async (req, res, next) => {
  try {
    const applications = await adminService.getSellerApplications();
    res.status(200).json({
      status: 'success',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { verified } = req.body;
    const seller = await adminService.verifySeller(sellerId, verified);
    res.status(200).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

exports.suspendSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { reason } = req.body;
    const seller = await adminService.suspendSeller(sellerId, reason);
    res.status(200).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

exports.reactivateSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const seller = await adminService.reactivateSeller(sellerId);
    res.status(200).json({
      status: 'success',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

// Statistics and Analytics Controllers
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await adminService.getUserStats();
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSellerStats = async (req, res, next) => {
  try {
    const stats = await adminService.getSellerStats();
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
