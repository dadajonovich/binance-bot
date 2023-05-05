const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

console.log(percentageDiffernce(0.55, 0.45));

module.exports = percentageDiffernce;
