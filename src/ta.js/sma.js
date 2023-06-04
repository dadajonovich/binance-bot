const ta = require('ta.js');

const getSMA = (closePrices, period = 50) => {
  const sma = ta.sma(closePrices, period);

  return sma;
};

module.exports = getSMA;
