const ta = require('ta.js');

const getSMA = ({ closePrices }) => ta.sma(closePrices);

module.exports = getSMA;
