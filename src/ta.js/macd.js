const ta = require('ta.js');

const getMACD = (value, length1 = 12, length2 = 26) => {
  const macd = ta.macd(value, length1, length2);
  return macd;
};

module.exports = getMACD;
