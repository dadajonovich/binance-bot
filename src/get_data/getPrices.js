const getPrices = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const volumes = candles.map((candle) => parseFloat(candle.quoteVolume));
  const currentPrice = closePrices.at(-1);
  const typicalPrice = candles.map(
    (candle) =>
      (parseFloat(candle.high) +
        parseFloat(candle.low) +
        parseFloat(candle.close)) /
      3
  );

  const openPrice = candles.map((candle) => parseFloat(candle.open));
  const highPrice = candles.map((candle) => parseFloat(candle.high));
  const lowPrice = candles.map((candle) => parseFloat(candle.low));

  return {
    closePrices,
    volumes,
    currentPrice,
    typicalPrice,
    openPrice,
    highPrice,
    lowPrice,
  };
};

module.exports = getPrices;
