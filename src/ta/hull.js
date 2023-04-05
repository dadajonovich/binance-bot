const ta = require('ta.js');

const getHull = ({ closePrices }) => {
  const hull = ta.hull(closePrices);

  return hull;
};

module.exports = getHull;
