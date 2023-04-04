const ta = require('ta.js');

const getEMA = ({ closePrices, currentPrice }) => {
  const ema = ta.ema(closePrices);
  const percentDifferenceFromEMA =
    ((ema.at(-1) - currentPrice) / currentPrice) * 100;

  let status;
  ema.at(-1) > currentPrice ? (status = '🔴') : (status = '🟢');

  let messageEMA = `- ${status}EMA ${ema
    .at(-1)
    .toFixed(2)} / ${percentDifferenceFromEMA.toFixed(2)}%`;

  return messageEMA;
};

module.exports = getEMA;
