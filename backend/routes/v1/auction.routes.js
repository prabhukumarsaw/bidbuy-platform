const express = require('express');
const auctionController = require('../../controllers/v1/auction.controller');
const { cache } = require('../../middleware/index');

const router = express.Router();

// Public routes
router.get(
  '/',
  // cache({ ttl: 1800 }),
  auctionController.getAllAuctions
);
router.get('/active', auctionController.getActiveAuctions);
router.get('/category/:categoryId', auctionController.getAuctionsByCategory);
router.get('/:id', auctionController.getAuctionById);
router.get('/:id/bids', auctionController.getAuctionBids);

module.exports = router;
