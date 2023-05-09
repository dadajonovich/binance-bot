const ta = require('ta.js');

const getVolatility = ({ closePrices, average }) => {
  const standartDeviation = ta.std(closePrices);
  const volatility = (standartDeviation / average) * 100;

  return volatility;
};

module.exports = getVolatility;
