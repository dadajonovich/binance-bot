const ta = require('ta.js');

const getSMA = (closePrices, period = closePrices.length) => {
  const sma = ta.sma(closePrices, period);

  return sma;
};

module.exports = getSMA;
