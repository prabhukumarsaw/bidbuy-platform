export const getPriceRecommendation = (
  currentPrice: number,
  bidHistory: number[]
): number => {
  const avgIncrement = bidHistory
    .slice(1)
    .reduce((acc, bid, i) => acc + (bid - bidHistory[i]), 0) / (bidHistory.length - 1);
  
  return Math.ceil((currentPrice + avgIncrement) / 5) * 5;
};

export const getMarketValueEstimate = (
  similarItemsPrices: number[],
  condition: string,
  age: number
): number => {
  const basePrice = similarItemsPrices.reduce((a, b) => a + b, 0) / similarItemsPrices.length;
  const conditionMultiplier = condition === 'Excellent' ? 1.2 : 1;
  const ageMultiplier = Math.min(1.5, 1 + (age / 100));
  
  return Math.round(basePrice * conditionMultiplier * ageMultiplier);
};