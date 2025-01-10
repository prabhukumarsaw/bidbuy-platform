const express = require('express');
const { protect, restrictTo } = require('../../middleware/index');
const {
  getUsers,
  getSellerApplications,
  verifySeller,
  deactivateUser,
  reactivateUser,
  getAllSellers,
  suspendSeller,
  reactivateSeller,
  getUserStats,
  getSellerStats,
  getAdminDashboardStats,
} = require('../../controllers/admin/admin-controller');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('ADMIN'));

// User Management Routes
router.get('/users', getUsers);
router.patch('/users/:userId/deactivate', deactivateUser);
router.patch('/users/:userId/reactivate', reactivateUser);

// Seller Management Routes
router.get('/sellers', getAllSellers);
router.get('/seller-applications', getSellerApplications);
router.patch('/sellers/:sellerId/verify', verifySeller);
router.patch('/sellers/:sellerId/suspend', suspendSeller);
router.patch('/sellers/:sellerId/reactivate', reactivateSeller);

// Statistics and Analytics Routes
router.get('/stats/users', getUserStats);
router.get('/stats/sellers', getSellerStats);
router.get('/stats/dashboard', getAdminDashboardStats);

module.exports = router;
