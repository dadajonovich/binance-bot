import getATR from './getATR.js';
import getEMA from './getEMA.js';

const getKeltner = (
  closePrices,
  highPrice,
  lowPrice,
  length = 20,
  devi = 2,
) => {
  const atr = getATR(closePrices, highPrice, lowPrice, length);
  const emaValues = getEMA(closePrices, length);
  const keltnerBands = [];

  for (let i = 0; i < emaValues.length; i++) {
    const upperBand = emaValues[i] + atr[i] * devi;
    const middleBand = emaValues[i];
    const lowerBand = emaValues[i] - atr[i] * devi;
    keltnerBands.push([upperBand, middleBand, lowerBand]);
  }

  return { keltnerBands, atr };
};

export default getKeltner;
