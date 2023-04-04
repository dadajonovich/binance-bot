const ta = require('ta.js');

const getBOP = ({ openPrice, highPrice, lowPrice, closePrices }) => {
  const bop = ta.bop(
    openPrice.map((openPrice, index) => [
      openPrice,
      highPrice[index],
      lowPrice[index],
      closePrices[index],
    ])
  );

  return bop;
};

module.exports = getBOP;
