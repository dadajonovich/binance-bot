const getSMA = require('./sma');
const getEMA = require('./ema');
const getHULL = require('./hull');
const getOBV = require('./obv');
const percentageDiffernce = require('./percentageDiffernce');
const getStandartDeviation = require('./standartDeviation');

module.exports = {
  getSMA,
  getEMA,
  getHULL,
  getOBV,
  percentageDiffernce,
  getStandartDeviation,
};
