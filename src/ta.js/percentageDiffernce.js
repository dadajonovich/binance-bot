const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

// console.log(percentageDiffernce(143298, 122688));
console.log(percentageDiffernce(12, 15));
module.exports = percentageDiffernce;
