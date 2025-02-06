const express = require('express');
const adminAuctionController = require('../../controllers/admin/admin-auction.controller');
const { protect, restrictTo, validate, cache } = require('../../middleware');
const {
  createAuctionSchema,
  updateAuctionSchema,
  updateStatusSchema,
  querySchema,
} = require('../../validators/auction.validator');
const { adminAuctionUpload } = require('../../middleware/upload');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(restrictTo('ADMIN'));

// Admin auction management
router.get(
  '/dashboard',
  // validate(querySchema, 'query'),
  adminAuctionController.getDashboardStats
);
router.get(
  '/analytics',
  // validate(querySchema, 'query'),
  adminAuctionController.getAnalytics
);

// Auction management
router.post(
  '/',
  adminAuctionUpload,
  //   validate(createAuctionSchema),
  adminAuctionController.createAuction
);
router.put(
  '/:id',
  // validate(updateAuctionSchema),
  adminAuctionController.updateAuction
);
router.delete('/:id', adminAuctionController.deleteAuction);
router.patch(
  '/:id/status',
  // validate(updateStatusSchema),
  adminAuctionController.updateAuctionStatus
);

// Auction insights

router.get('/', adminAuctionController.getAllAuctions);
router.get('/active', adminAuctionController.getActiveAuctions);
router.get('/:id', adminAuctionController.getAuctionById);

module.exports = router;
