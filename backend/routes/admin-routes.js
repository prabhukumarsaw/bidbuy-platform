const express = require('express');
const { protect, restrictTo } = require('../middleware/auth-middleware');
const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/admin-controller');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

module.exports = router;