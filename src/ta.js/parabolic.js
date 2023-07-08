const ta = require('ta.js');

const getParabolic = (highPrice, lowPrice, step = 0.01, max = 0.2) => {
  const inputArray = highPrice.map((high, index) => [high, lowPrice[index]]);
  const parabolicSar = ta.psar(inputArray, step, max);
  return parabolicSar;
};

module.exports = getParabolic;
