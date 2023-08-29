import kaufmanMovingAverage from './kaufmanMovingAverage.js';
import std from './std.js';

const calculateValueBetweenPeriods = (array) => {
  const valueDifferences = [];
  for (let i = 0; i < array.length - 1; i++) {
    const difference = array[i + 1] - array[i];
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
