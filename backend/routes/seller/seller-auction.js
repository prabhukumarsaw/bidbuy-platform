const express = require('express');
const sellerAuctionController = require('../../controllers/seller/auction.controller');
const { protect, restrictTo, validate, cache } = require('../../middleware');
const {
  createAuctionSchema,
  updateAuctionSchema,
  updateStatusSchema,
  querySchema,
} = require('../../validators/auction.validator');

const router = express.Router();

// All routes require seller authentication
router.use(protect);
router.use(restrictTo('SELLER'));

// seller auction management
router.get(
  '/dashboard',
  validate(querySchema, 'query'),
  sellerAuctionController.getDashboardStats
);
router.get(
  '/analytics',
  validate(querySchema, 'query'),
  sellerAuctionController.getAnalytics
);

// Auction management
router.post(
  '/',
  //   validate(createAuctionSchema),
  sellerAuctionController.createAuction
);
router.put(
  '/:id',
  validate(updateAuctionSchema),
  sellerAuctionController.updateAuction
);
router.delete('/:id', sellerAuctionController.deleteAuction);
router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  sellerAuctionController.updateAuctionStatus
);

// Auction insights

router.get('/', cache({ ttl: 1800 }), sellerAuctionController.getAllAuctions);
router.get('/active', sellerAuctionController.getActiveAuctions);
router.get('/:id', sellerAuctionController.getAuctionById);

module.exports = router;
