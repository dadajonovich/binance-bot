const ta = require('ta.js');

const getVWMA = ({ closePrices, volumes }) => {
  const vwma = ta.vwma(
    closePrices.map((price, index) => [price, volumes[index]])
  );

  return vwma;
};

module.exports = getVWMA;
