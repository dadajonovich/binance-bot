const ta = require('ta.js');

const getMACD = (array) => ta.macd(array);

module.exports = getMACD;
