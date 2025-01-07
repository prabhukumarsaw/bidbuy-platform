/**
 * Validates if the user has ownership rights over an auction
 */
const validateOwnership = (user, auction) => {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'SELLER' && user.seller?.id === auction.sellerId)
    return true;
  return false;
};

/**
 * Validates auction timing constraints
 */
const validateAuctionTiming = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start < now) {
    throw new Error('Start time must be in the future');
  }
  if (end <= start) {
    throw new Error('End time must be after start time');
  }
  if (end - start < 60 * 60 * 1000) {
    // Minimum 1 hour duration
    throw new Error('Auction duration must be at least 1 hour');
  }
};

module.exports = {
  validateOwnership,
  validateAuctionTiming,
};
