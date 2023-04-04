const ta = require('ta.js');

const getWMA = ({ closePrices }) => {
  const wma = ta.wma(closePrices);

  return wma;
};

module.exports = getWMA;
