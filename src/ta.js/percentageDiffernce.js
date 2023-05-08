const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

console.log(percentageDiffernce(0.45, 0.55));

module.exports = percentageDiffernce;
