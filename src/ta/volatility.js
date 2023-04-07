const getVolatility = ({ openPrices, closePrices }) => {
  const priceChanges = closePrices.map(
    (closePrice, i) => openPrices[i] / closePrice - 1
  );
  const averagePriceChange =
    priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;

  const variance =
    priceChanges.reduce(
      (sum, change) => sum + (change - averagePriceChange) ** 2,
      0
    ) / priceChanges.length;

  const standardDeviation = Math.sqrt(variance);

  const volatility = standardDeviation * 100;

  return volatility;
};

module.exports = getVolatility;
