import kaufmanMovingAverage from './kaufmanMovingAverage.js';
import std from './std.js';

const calculateValueBetweenPeriods = (array) => {
  const valueDifferences = [];
  for (let i = 1; i < array.length; i++) {
    const difference = array[i] - array[i - 1];
    valueDifferences.push(difference);
  }
  return valueDifferences;
};

const getKAMA = (closePrices, length1 = 10, length2 = 2, length3 = 30) => {
  const kama = kaufmanMovingAverage(closePrices, length1, length2, length3);
  const stndDevKama = std(calculateValueBetweenPeriods(kama), 20);
  const filterKama = 1 * stndDevKama;

  return { kama, filterKama };
};

export default getKAMA;
