const ta = require('ta.js');

const getRSI = ({ closePrices }) => ta.rsi(closePrices);

module.exports = getRSI;
