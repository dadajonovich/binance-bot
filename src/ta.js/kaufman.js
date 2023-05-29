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
  const filterKama = 1 * stndDevKama;
  return { kama, filterKama };
};

module.exports = getKaufman;
