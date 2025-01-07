const calculateNextMinimumBid = (currentPrice, minBidIncrement) => {
  return currentPrice + minBidIncrement;
};

const isAuctionActive = (auction) => {
  const now = new Date();
  return (
    auction.status === 'ACTIVE' &&
    auction.startTime <= now &&
    auction.endTime > now
  );
};

const calculateTimeLeft = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
};

module.exports = {
  calculateNextMinimumBid,
  isAuctionActive,
  calculateTimeLeft
};