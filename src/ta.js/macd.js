const ta = require('ta.js');

const getMACD = (value) => {
  const macd = ta.macd(value);
  return macd;
};

// console.log(
//   getMACD([
//     -1, -2, -3, -4, -5, -6, -7, -8, -9, -12, -13, -14, -15, -16, -17, -18, -19,
//     -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, 30,
//   ])
// );

module.exports = getMACD;
