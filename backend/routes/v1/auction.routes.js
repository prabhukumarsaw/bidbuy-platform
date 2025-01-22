const express = require('express');
const auctionController = require('../../controllers/v1/auction.controller');
const BidController = require('../../controllers/bid/bid-controller');
const { protect, restrictTo, cache } = require('../../middleware/index');

const router = express.Router();
const bidController = new BidController();

router.get('/testData', bidController.testData);
// Public routes
router.get(
  '/',
  // cache({ ttl: 1800 }),
  auctionController.getAllAuctions
); // Get all auctions
router.get('/active', auctionController.getActiveAuctions); // Get active auctions
router.get('/category/:categoryId', auctionController.getAuctionsByCategory); // Get auctions by category
router.get('/:id', auctionController.getAuctionById); // Get auction by ID

// Bidding routes under auction
router.get('/:auctionId/bids', bidController.getAuctionBids); // Get all bids for an auction
router.get('/:auctionId/winning-bid', bidController.getWinningBid); // Get winning bid for an auction

// Protected routes (require authentication)
router.use(protect);

// Place a bid on an auction
router.post(
  '/:auctionId/bids',
  // restrictTo('USER'),
  bidController.placeBid
);

// Additional bidding routes (if needed)
router.get('/users/active-bids', bidController.getUserActiveBids); // Get active bids for the logged-in user
router.get('/bids/:bidId', bidController.getBidById); // Get a specific bid by ID

module.exports = router;
