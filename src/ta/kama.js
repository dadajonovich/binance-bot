const ta = require('ta.js');

const getKAMA = ({ closePrices }) => {
  const kama = ta.kama(closePrices);

  return kama;
};

module.exports = getKAMA;
