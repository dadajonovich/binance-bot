const ta = require('ta.js');

const getMACD = ({ closePrices }) => {
  const macd = ta.macd(closePrices);

  let status;
  macd.at(-1) > macd.at(-2) ? (status = '📈') : (status = '📉');

  const messageMACD = `- ${status}MACD ${macd.at(-2).toFixed(2)} to ${macd
    .at(-1)
    .toFixed(2)}`;

  const criterion = macd.at(-1) > 0 && macd.at(-2) < 0;

  return criterion;
};

module.exports = getMACD;
