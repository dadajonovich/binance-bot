const ta = require('ta.js');

const getATR = (closePrices, highPrice, lowPrice, length = 14) => {
  const inputArray = closePrices.map((closePrice, index) => [
    highPrice[index],
    closePrice,
    lowPrice[index],
  ]);
  const atr = ta.atr(inputArray, length);
  return atr;
};

module.exports = getATR;
