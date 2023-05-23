const ta = require('ta.js');

const getMOM = (closePrices, length = 14, percentage = false) =>
  ta.mom(closePrices, length, percentage);

module.exports = getMOM;
