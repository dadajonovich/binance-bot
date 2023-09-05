import averageTrueRange from './atr.js';
import ema from './ema.js';

const keltner = (closePrices, highPrice, lowPrice, length = 20, devi = 2) => {
  const atr = averageTrueRange(closePrices, highPrice, lowPrice, length);
  const emaValues = ema(closePrices, length);
  const keltnerBands = [];

  for (let i = 0; i < emaValues.length; i++) {
    const upperBand = emaValues[i] + atr[i] * devi;
    const middleBand = emaValues[i];
    const lowerBand = emaValues[i] - atr[i] * devi;
    keltnerBands.push([upperBand, middleBand, lowerBand]);
  }

  return { keltnerBands, atr };
};

export default keltner;
