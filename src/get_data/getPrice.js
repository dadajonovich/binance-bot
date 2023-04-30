const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const currentPrice = closePrices.at(-1);

  return {
    closePrices,
    currentPrice,
  };
};

module.exports = getPrice;
