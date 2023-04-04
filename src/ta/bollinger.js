const ta = require('ta.js');

const getBollinger = ({ closePrices }) => {
  const bollinger = ta.bands(closePrices);

  const [lastUpper, lastMiddle, lastLower] = bollinger[bollinger.length - 1];

  const [penultimateUpper, penultimateMiddle, penultimateLower] =
    bollinger[bollinger.length - 2];
};

module.exports = getBollinger;
