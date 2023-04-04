const ta = require('ta.js');

const getEMA = ({ closePrices, currentPrice }) => {
  const ema = ta.ema(closePrices);

  return ema;
};

module.exports = getEMA;
