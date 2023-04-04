const ta = require('ta.js');

const getRSI = ({ closePrices }) => {
  const rsi = ta.rsi(closePrices);

  let status;
  rsi.at(-1) > rsi.at(-2) ? (status = '📈') : (status = '📉');

  const messageRSI = `- ${status}RSI ${rsi.at(-1).toFixed(2)}`;

  return messageRSI;
};

module.exports = getRSI;
