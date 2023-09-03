import averageTrueRange from './atr.js';
import calculateValueBetweenPeriods from './calculateValueBetweenPeriods.js';
import calculateFilter from './calculatelteFilter.js';

const getATR = (closePrices, highPrice, lowPrice, length = 10) => {
  const atr = averageTrueRange(closePrices, highPrice, lowPrice, length);
  const valueBetweenPeriods = calculateValueBetweenPeriods(atr);
  const filterAtr = calculateFilter(valueBetweenPeriods);
  return { atr, filterAtr };
};

export default getATR;

// const arr = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169,
//   6173.8633953257995, 6188.834223220775, 6188.430925674707, 6192.414842335993,
//   6191.980911048277, 6193.220691200195, 6196.358249615615, 6210.195220657128,
//   6228.4229321449675, 6248.600756698224, 6282.719402924608, 6296.908873143119,
//   6318.935240872848, 6347.362412909954, 6376.271518891558, 6431.390105480862,
//   6470.440626721937, 6468.065992324839, 6472.673287116851, 6487.965105840851,
//   6492.943657392142, 6500.980186010626, 6512.250934708962, 6531.7419807408605,
//   6531.862378839739, 6531.972574950088, 6532.161746689747, 6534.30701550104,
//   6534.031595997395, 6534.315542290985,
// ];

// const diff = calculateValueBetweenPeriods(arr);
// const stdFilter = calculateFilter(diff);
// console.log(stdFilter);
