const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const average = closePrices.reduce((a, b) => a + b, 0) / closePrices.length;
  const currentPrice = closePrices.at(-1);
  const volumes = candles.map((candle) => parseFloat(candle.volume));
  const highPrice = candles.map((candle) => parseFloat(candle.high));
  const lowPrice = candles.map((candle) => parseFloat(candle.low));

  return {
    average,
    closePrices,
    currentPrice,
    volumes,
    highPrice,
    lowPrice,
  };
};

module.exports = getPrice;
