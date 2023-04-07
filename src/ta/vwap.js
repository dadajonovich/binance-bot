const ta = require('ta.js');

const getVWAP = ({ typicalPrices, volumes }) => {
  const inputArray = typicalPrices.map((typicalPrice, index) => [
    typicalPrice,
    volumes[index],
  ]);

  const vwap = ta.vwap(inputArray, inputArray.length - 1);

  return vwap;
};

module.exports = getVWAP;
