import averageTrueRange from './atr.js';
import calculateValueBetweenPeriods from './calculateValueBetweenPeriods.js';
import calculateFilter from './calculatelteFilter.js';

const getATR = (closePrices, highPrice, lowPrice, length = 10) => {
  const atr = averageTrueRange(closePrices, highPrice, lowPrice, length);
  const valueBetweenPeriods = calculateValueBetweenPeriods(atr);
  const filterAtr = calculateFilter(valueBetweenPeriods, 20);
  return { atr, filterAtr };
};

export default getATR;
