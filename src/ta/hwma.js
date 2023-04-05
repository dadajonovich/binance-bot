const ta = require('ta.js');

const getHWMA = ({ closePrices }) => {
  const hwma = ta.hwma(closePrices);

  return hwma;
};

module.exports = getHWMA;
