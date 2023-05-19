const ta = require('ta.js');

const getStandartDeviation = (value) => {
  const standartDeviation = ta.std(value);

  return standartDeviation;
};

module.exports = getStandartDeviation;
