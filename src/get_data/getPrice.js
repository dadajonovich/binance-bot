const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const currentPrice = closePrices.at(-1);
  const volumes = candles.map((candle) => parseFloat(candle.volume));

  return {
    closePrices,
    currentPrice,
    volumes,
  };
};

module.exports = getPrice;
