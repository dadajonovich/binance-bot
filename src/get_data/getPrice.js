const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  const openPrices = candles.map((candle) => parseFloat(candle.open));
  const currentPrice = closePrices.at(-1);
  const highPrice = candles.map((candle) => parseFloat(candle.high));
  const lowPrice = candles.map((candle) => parseFloat(candle.low));

  const rangeCandlePercent = candles.map((candle) =>
    Math.abs(percentageDiffernce(candle.close, candle.open))
  );

  return {
    closePrices,
    openPrices,
    currentPrice,
    highPrice,
    lowPrice,
    rangeCandlePercent,
  };
};

module.exports = getPrice;
