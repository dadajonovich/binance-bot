const getPrice = (candles) => {
  const closePrices = candles.map((candle) => parseFloat(candle.close));
  // const openPrices = candles.map((candle) => parseFloat(candle.open));
  // const currentPrice = parseFloat(closePrices.at(-1));
  const highPrice = candles.map((candle) => parseFloat(candle.high));
  const lowPrice = candles.map((candle) => parseFloat(candle.low));
  // const volume = candles.map((candle) => parseFloat(candle.volume));
  // const typicalPrices = candles.map(
  //   (candle) =>
  //     (parseFloat(candle.high) +
  //       parseFloat(candle.low) +
  //       parseFloat(candle.close)) /
  //     3
  // );

  return {
    closePrices,
    // openPrices,
    // currentPrice,
    highPrice,
    lowPrice,
    // volume,
    // typicalPrices,
  };
};

export default getPrice;
