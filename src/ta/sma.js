const ta = require('ta.js');

const getSMA = ({ closePrices, currentPrice }) => {
  const sma = ta.sma(closePrices);

  return sma;
};

module.exports = getSMA;
