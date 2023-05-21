const ta = require('ta.js');

const getOBV = (closePrices, volumes) => {
  const obv = ta.obv(
    volumes.map((volume, index) => [volume, closePrices[index]])
  );
  return obv;
};

module.exports = getOBV;
