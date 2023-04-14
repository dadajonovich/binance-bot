const ta = require('ta.js');

const getMACD = ({ closePrices }) => ta.macd(closePrices);

module.exports = getMACD;
