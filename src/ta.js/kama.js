const ta = require('ta.js');

const calculateValueBetweenPeriods = (array) => {
  const valueDifferences = [];
  for (let i = 0; i < array.length - 1; i++) {
    const difference = array[i + 1] - array[i];
    valueDifferences.push(difference);
  }
  return valueDifferences;
};

const getKAMA = (closePrices, length1 = 10, length2 = 2, length3 = 30) => {
  const kama = ta.kama(closePrices, length1, length2, length3);
  const stndDevKama = ta.std(calculateValueBetweenPeriods(kama));
  const filterKama = 1 * stndDevKama;

  return { kama, filterKama };
};

module.exports = getKAMA;
