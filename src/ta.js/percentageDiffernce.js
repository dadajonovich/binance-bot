const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

module.exports = percentageDiffernce;
