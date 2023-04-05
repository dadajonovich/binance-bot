const ta = require('ta.js');

const getVWAP = ({ tipicalPrice, volumes }) => {
  const inputArray = tipicalPrice.map((tipicalPrice, index) => [
    tipicalPrice,
    volumes[index],
  ]);

  const vwap = ta.vwap(inputArray, inputArray.length - 1);

  return vwap;
};

module.exports = getVWAP;
