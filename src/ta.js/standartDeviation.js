const ta = require('ta.js');

const getStandartDeviation = ({ closePrices }) => {
  const standartDeviation = ta.std(closePrices);

  return standartDeviation;
};

module.exports = getStandartDeviation;
