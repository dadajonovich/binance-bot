const ta = require('ta.js');

const getSMA = ({ closePrices }) => {
  const sma = ta.sma(closePrices);

  return sma;
};

module.exports = getSMA;
