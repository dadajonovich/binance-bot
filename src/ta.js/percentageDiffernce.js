const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

console.log(percentageDiffernce(-143298, -122688));

module.exports = percentageDiffernce;
