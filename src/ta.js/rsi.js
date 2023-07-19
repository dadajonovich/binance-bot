const ta = require('ta.js');

const getRSI = (closePrices, period = '14') => ta.rsi(closePrices, period);

module.exports = getRSI;
