const ta = require('ta.js');

const getPWMA = ({ closePrices }) => {
  const pwma = ta.pwma(closePrices);

  return pwma;
};

module.exports = getPWMA;
