const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, notificationController.getUserNotifications);

router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

router.delete(
  '/:id',
  authMiddleware,
  notificationController.deleteNotification
);

router.post(
  '/mark-all-read',
  authMiddleware,
  notificationController.markAllAsRead
);

module.exports = router;
