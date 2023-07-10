const ta = require('ta.js');

const getStoch = (
  closePrices,
  highPrice,
  lowPrice,
  length = 14,
  smoothd = 1,
  smoothk = 3
) => {
  const inputArray = closePrices.map((closePrice, index) => [
    highPrice[index],
    closePrice,
    lowPrice[index],
  ]);
  const stoch = ta.stoch(inputArray, length, smoothd, smoothk);
  return stoch;
};

module.exports = getStoch;
