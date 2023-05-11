const getSMA = require('./sma');
const getEMA = require('./ema');
const getMACD = require('./macd');
const getRSI = require('./rsi');
const getOBV = require('./obv');
const percentageDiffernce = require('./percentageDiffernce');
const getVWMA = require('./vwma');
const getStandartDeviation = require('./standartDeviation');
const getWilliams = require('./williams');
const getBollinger = require('./bollinger');

module.exports = {
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getOBV,
  percentageDiffernce,
  getVWMA,
  getStandartDeviation,
  getWilliams,
  getBollinger,
};
