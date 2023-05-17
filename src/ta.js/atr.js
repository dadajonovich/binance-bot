const ta = require('ta.js');

const getATR = ({ highPrice, closePrices, lowPrice }) => {
  const atr = ta.atr(
    highPrice.map((high, index) => [
      highPrice[index],
      closePrices[index],
      lowPrice[index],
    ])
  );

  return atr;
};

module.exports = getATR;
