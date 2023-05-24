const getSMA = require('./sma');
const getEMA = require('./ema');
const getHULL = require('./hull');
const getMACD = require('./macd');
const getRSI = require('./rsi');
const getOBV = require('./obv');
const percentageDiffernce = require('./percentageDiffernce');
const getStandartDeviation = require('./standartDeviation');

module.exports = {
  getSMA,
  getEMA,
  getHULL,
  getMACD,
  getRSI,
  getOBV,
  percentageDiffernce,
  getStandartDeviation,
};
