const ta = require('ta.js');

const getBollinger = ({ closePrices }) => {
  const bollinger = ta.bands(closePrices);

  const [lastUpper, lastMiddle, lastLower] = bollinger[bollinger.length - 1];

  const [penultimateUpper, penultimateMiddle, penultimateLower] =
    bollinger[bollinger.length - 2];

  const messageBollinger = `- Bollinger Bands U${penultimateUpper.toFixed(
    2
  )}/M${penultimateMiddle.toFixed(2)}/L${penultimateLower.toFixed(
    2
  )} to U${lastUpper.toFixed(2)}/M${lastMiddle.toFixed(2)}/L${lastLower.toFixed(
    2
  )}`;

  return messageBollinger;
};

module.exports = getBollinger;
