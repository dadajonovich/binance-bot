const ta = require('ta.js');

const getHULL = (closePrices, period) => {
  let hull;
  if (!period) {
    hull = ta.hull(closePrices);
  } else {
    hull = ta.hull(closePrices, period);
  }
  return hull;
};

module.exports = getHULL;
