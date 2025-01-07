const bidService = require('../services/bid.service');
const { ApiError } = require('../utils/api-error');

class BidController {
  async placeBid(req, res) {
    try {
      const { auctionId } = req.params;
      const { amount } = req.body;
      const bid = await bidService.placeBid(auctionId, req.user.id, amount);
      res.status(201).json(bid);
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  }

  async getUserBids(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const bids = await bidService.getUserBids(req.user.id, { status, page, limit });
      res.json(bids);
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  }

  async getWinningBids(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const bids = await bidService.getWinningBids(req.user.id, { page, limit });
      res.json(bids);
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  }
}

module.exports = new BidController();