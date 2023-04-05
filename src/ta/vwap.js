const ta = require('ta.js');

const getVWAP = ({ typicalPrice, volumes }) => {
  const inputArray = typicalPrice.map((typicalPrice, index) => [
    typicalPrice,
    volumes[index],
  ]);

  const vwap = ta.vwap(inputArray, inputArray.length - 1);

  return vwap;
};

module.exports = getVWAP;
