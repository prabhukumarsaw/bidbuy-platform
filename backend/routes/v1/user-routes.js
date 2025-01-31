const express = require('express');
const { protect, restrictTo } = require('../../middleware/index');
const {
  getUserProfile,
  updateUserProfile,
  getUserBids,
  getUserNotifications,
  getUserInbox,
  getUserActionLogs,
  markNotificationAsRead,
  markMessageAsRead,
} = require('../../controllers/v1/user-controller');
const router = express.Router();
// Protect all user routes
router.use(protect);
router.use(restrictTo('USER'));
// Profile routes
router.get('/profile', getUserProfile);
router.patch('/profile', updateUserProfile);
// Activity routes
router.get('/bids', getUserBids);
router.get('/notifications', getUserNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);
router.get('/inbox', getUserInbox);
router.patch('/inbox/:id/read', markMessageAsRead);
router.get('/activity', getUserActionLogs);
module.exports = router;
