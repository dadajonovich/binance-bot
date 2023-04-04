const ta = require('ta.js');

const getVWAP = ({ tipicalPrice, volumes, currentPrice }) => {
  const vwap = ta.vwap(
    tipicalPrice.map((tipicalPrice, index) => [tipicalPrice, volumes[index]])
  );

  const percentDifferenceFromVWAP =
    ((vwap.at(-1) - currentPrice) / currentPrice) * 100;

  let status;
  vwap.at(-1) > currentPrice ? (status = '🔴') : (status = '🟢');

  let messageVWAP = `- ${status}VWAP ${vwap
    .at(-1)
    .toFixed(2)} / ${percentDifferenceFromVWAP.toFixed(2)}%`;

  return messageVWAP;
};

module.exports = getVWAP;
