const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const typicalPrices = candles.map(
    (candle) =>
      (parseFloat(candle.high) +
        parseFloat(candle.low) +
        parseFloat(candle.close)) /
      3
  );
  const openPrices = candles.map((candle) => parseFloat(candle.open));
  const currentPrice = closePrices.at(-1);
  const volumes = candles.map((candle) => parseFloat(candle.volume));
  const highPrice = candles.map((candle) => parseFloat(candle.high));
  const lowPrice = candles.map((candle) => parseFloat(candle.low));

  return {
    closePrices,
    typicalPrices,
    openPrices,
    currentPrice,
    volumes,
    highPrice,
    lowPrice,
  };
};

module.exports = getPrice;
