const ta = require('ta.js');

const getKeltner = (
  closePrices,
  highPrice,
  lowPrice,
  length = 20,
  deviations = 2
) => {
  const inputArray = closePrices.map((closePrice, index) => [
    highPrice[index],
    closePrice,
    lowPrice[index],
  ]);
  const keltner = ta.keltner(inputArray, length, deviations);
  return keltner;
};

module.exports = getKeltner;
