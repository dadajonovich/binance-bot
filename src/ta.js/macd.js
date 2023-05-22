const ta = require('ta.js');

const getMACD = (value) => {
  const macd = ta.macd(value);
  return macd;
};

module.exports = getMACD;
