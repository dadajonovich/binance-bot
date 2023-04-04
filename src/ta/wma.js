const ta = require('ta.js');

const getWMA = ({ closePrices, currentPrice }) => {
  const wma = ta.wma(closePrices);

  const percentDifferenceFromWMA =
    ((wma.at(-1) - currentPrice) / currentPrice) * 100;

  let status;
  wma.at(-1) > currentPrice ? (status = '🔴') : (status = '🟢');

  let messageWMA = `- ${status}WMA ${wma
    .at(-1)
    .toFixed(2)} / ${percentDifferenceFromWMA.toFixed(2)}%`;

  return messageWMA;
};

module.exports = getWMA;
