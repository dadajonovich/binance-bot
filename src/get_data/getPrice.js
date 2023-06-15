const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const openPrices = candles.map((candle) => parseFloat(candle.open));
  const currentPrice = closePrices.at(-1);
  const highPrice = candles.map((candle) => parseFloat(candle.high));
  const lowPrice = candles.map((candle) => parseFloat(candle.low));

  return {
    closePrices,
    openPrices,
    currentPrice,
    highPrice,
    lowPrice,
  };
};

module.exports = getPrice;
