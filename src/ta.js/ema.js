const ta = require('ta.js');

const getEMA = (closePrices, period) => {
  let ema;
  if (!period) {
    ema = ta.ema(closePrices);
  } else {
    ema = ta.ema(closePrices, period);
  }
  return ema;
};

module.exports = getEMA;
