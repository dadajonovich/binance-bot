const ta = require('ta.js');

const getVolatility = ({ closePrices, currentPrice }) => {
  const standartDeviation = ta.std(closePrices);
  const volatility = (standartDeviation / currentPrice) * 100;

  return { volatility, standartDeviation };
};

module.exports = getVolatility;
