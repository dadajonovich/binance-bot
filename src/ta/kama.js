import kaufmanMovingAverage from './kaufmanMovingAverage.js';
import std from './std.js';

const calculateValueBetweenPeriods = (array) => {
  const valueDifferences = [];
  for (let i = 1; i < array.length; i++) {
    const difference = array[i] - array[i - 1];
    // console.log(`${array[i]} - ${array[i - 1]}`);
    valueDifferences.push(difference);
  }
  // console.log(valueDifferences);
  return valueDifferences;
};

const calcucalteFilter = (data, filter = 1, length1 = 10) => {
  const arrStd = [];
  for (let i = 0; i <= data.length - length1; i++) {
    arrStd.push(std(data.slice(i, i + length1)) * filter);
  }
  // console.log(arrStd);
  return arrStd;
};

const getKAMA = (
  closePrices,
  length1 = 10,
  length2 = 2,
  length3 = 30,
  filter = 1
) => {
  const kama = kaufmanMovingAverage(closePrices, length1, length2, length3);
  const valueBetweenPeriods = calculateValueBetweenPeriods(kama);
  const filterKama = calcucalteFilter(valueBetweenPeriods, filter);
  return { kama, filterKama };
};

export default getKAMA;

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
// const stdFilter = calcucalteFilter(diff, 1);
