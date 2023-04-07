const getPrices = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const volumes = candles.map((candle) => parseFloat(candle.quoteVolume));
  const currentPrice = closePrices.at(-1);
  const typicalPrices = candles.map(
    (candle) =>
      (parseFloat(candle.high) +
        parseFloat(candle.low) +
        parseFloat(candle.close)) /
      3
  );

  const openPrices = candles.map((candle) => parseFloat(candle.open));
  const highPrices = candles.map((candle) => parseFloat(candle.high));
  const lowPrices = candles.map((candle) => parseFloat(candle.low));

  return {
    closePrices,
    volumes,
    currentPrice,
    typicalPrices,
    openPrices,
    highPrices,
    lowPrices,
  };
};

module.exports = getPrices;
