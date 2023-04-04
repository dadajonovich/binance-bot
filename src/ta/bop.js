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

  let status;
  bop.at(-1) > bop.at(-2) ? (status = '📈') : (status = '📉');

  const messageBOP = `- ${status}BOP ${bop.at(-2).toFixed(2)} to ${bop
    .at(-1)
    .toFixed(2)}`;

  return messageBOP;
};

module.exports = getBOP;
