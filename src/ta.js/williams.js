const ta = require('ta.js');

const getWilliams = ({ closePrices }) => ta.pr(closePrices);

module.exports = getWilliams;
