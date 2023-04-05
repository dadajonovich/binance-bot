const ta = require('ta.js');

const getLSMA = ({ closePrices }) => {
  const lsma = ta.lsma(closePrices);

  return lsma;
};

module.exports = getLSMA;
