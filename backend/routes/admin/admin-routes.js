const express = require('express');
const { protect, restrictTo } = require('../../middleware/index');
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getSellerApplications,
  verifySeller,
} = require('../../controllers/admin/admin-controller');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('ADMIN'));

// Route to get all unverified seller applications
router.get('/seller-applications', getSellerApplications);

// Route to verify a seller application
router.patch('/verify-seller/:sellerId', verifySeller);

router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

module.exports = router;
