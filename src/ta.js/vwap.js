const ta = require('ta.js');

const getVWAP = (typicalPrices, volumes, length = 200) => {
  const inputArray = typicalPrices.map((typicalPrice, index) => [
    typicalPrice,
    volumes[index],
  ]);

  const vwap = ta.vwap(inputArray, length);

  return vwap;
};

module.exports = getVWAP;
