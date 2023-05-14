const ta = require('ta.js');

const getRSI = ({ closePrices }) => ta.wrsi(closePrices);

module.exports = getRSI;
