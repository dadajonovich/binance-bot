const ta = require('ta.js');

const getKeltner = (
  closePrices,
  highPrice,
  lowPrice,
  length = 9,
  deviations = 1.5
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
