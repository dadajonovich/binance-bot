const ta = require('ta.js');

const getOBV = (closePrices, volume) => {
  const obv = ta.obv(volume.map((vol, index) => [vol, closePrices[index]]));
  return obv;
};

module.exports = getOBV;
