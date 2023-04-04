const ta = require('ta.js');

const getVWMA = ({ closePrices, volumes, currentPrice }) => {
  const vwma = ta.vwma(
    closePrices.map((price, index) => [price, volumes[index]])
  );

  const percentDifferenceFromVWMA =
    ((vwma.at(-1) - currentPrice) / currentPrice) * 100;

  let status;
  vwma.at(-1) > currentPrice ? (status = '🔴') : (status = '🟢');

  let messageVWMA = `- ${status}VWMA ${vwma
    .at(-1)
    .toFixed(2)} / ${percentDifferenceFromVWMA.toFixed(2)}%`;

  return messageVWMA;
};

module.exports = getVWMA;
