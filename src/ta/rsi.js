const ta = require('ta.js');

const getRSI = ({ closePrices }) => {
  const rsi = ta.rsi(closePrices);
  return rsi;
};

module.exports = getRSI;
