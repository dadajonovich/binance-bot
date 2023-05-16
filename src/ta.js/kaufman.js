const ta = require('ta.js');

const calculateValueBetweenPeriods = (array) => {
  const valueDifferences = [];
  for (let i = 0; i < array.length - 1; i++) {
    const difference = array[i + 1] - array[i];
    valueDifferences.push(difference);
  }
  return valueDifferences;
};

const getKaufman = (value) => {
  const kama = ta.kama(value);
  const stndDevKama = ta.std(calculateValueBetweenPeriods(kama), 10);
  const filterKama = 0 * stndDevKama;
  return { kama, filterKama };
};

module.exports = getKaufman;

// const arrayMA = [
//   5, 12, 8, 3, 20, 6, 9, 15, 11, 4, 17, 2, 13, 7, 10, 1, 16, 19, 14, 18, 25, 22,
//   23, 30, 28, 21, 26, 35, 27, 24, 31, 33, 34, 29, 32,
// ];

// const MA = getKaufman(arrayMA);
// console.log(MA);
// const calculateValueBetweenPeriods = (array) => {
//   return array.slice(1).map((current, index) => current - array[index]);
// };

// console.log(filter, stndDev);
