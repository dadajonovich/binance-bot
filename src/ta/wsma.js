const ta = require('ta.js');

const getWSMA = ({ closePrices }) => {
  const wsma = ta.wsma(closePrices);

  return wsma;
};

module.exports = getWSMA;
