const ta = require('ta.js');

const getBollinger = ({ closePrices }) => ta.bandwidth(closePrices);

module.exports = getBollinger;
