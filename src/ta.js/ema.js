const ta = require('ta.js');

const getEMA = ({ closePrices }) => ta.ema(closePrices);

module.exports = getEMA;
