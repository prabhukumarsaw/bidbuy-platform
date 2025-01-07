const express = require('express');
const bidController = require('../../controllers/bid/bid.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { validateRequest } = require('../../middleware/validate-request');
const { bidSchema } = require('../../validators/bid.validator');

const router = express.Router();

router.use(authMiddleware);

router.post('/:auctionId',
  validateRequest(bidSchema),
  bidController.placeBid
);

router.get('/user', bidController.getUserBids);
router.get('/auction/:auctionId', bidController.getAuctionBids);
router.get('/winning', bidController.getWinningBids);
router.get('/history', bidController.getBidHistory);

module.exports = router;