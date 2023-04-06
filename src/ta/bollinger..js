const ta = require('ta.js');

const getBollinger = ({ closePrices }) => {
  const bollinger = ta.bands(closePrices);
  return bollinger;
};

module.exports = getBollinger;
