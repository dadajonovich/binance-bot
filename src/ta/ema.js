const ta = require('ta.js');

const getEMA = ({ closePrices }) => {
  const ema = ta.ema(closePrices);

  return ema;
};

module.exports = getEMA;
