const ta = require('ta.js');

const getSMA = ({ closePrices, currentPrice }) => {
  const sma = ta.sma(closePrices);

  const percentDifferenceFromSMA =
    ((sma.at(-1) - currentPrice) / currentPrice) * 100;

  let status;
  sma.at(-1) > currentPrice ? (status = '🔴') : (status = '🟢');

  let messageSMA = `- ${status}SMA ${sma
    .at(-1)
    .toFixed(2)} / ${percentDifferenceFromSMA.toFixed(2)}%`;

  return messageSMA;
};

module.exports = getSMA;
