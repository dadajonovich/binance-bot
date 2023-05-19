const ta = require('ta.js');

const getSMA = (closePrices, period) => {
  let sma;
  if (!period) {
    sma = ta.sma(closePrices);
  } else {
    sma = ta.sma(closePrices, period);
  }
  return sma;
};

module.exports = getSMA;
