const ta = require('ta.js');

const getMACD = ({ closePrices }) => {
  const macd = ta.macd(closePrices);

  return macd;
};

module.exports = getMACD;
