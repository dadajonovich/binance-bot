const getSMA = require('./sma');
const getEMA = require('./ema');
const getHULL = require('./hull');
const percentageDiffernce = require('./percentageDiffernce');
const getStandartDeviation = require('./standartDeviation');

module.exports = {
  getSMA,
  getEMA,
  getHULL,
  percentageDiffernce,
  getStandartDeviation,
};
