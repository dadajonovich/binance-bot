const getSMA = require('./sma');
const getEMA = require('./ema');
const getMACD = require('./macd');
const getRSI = require('./rsi');
const getOBV = require('./obv');
const getVWAP = require('./vwap');
const getEnvelope = require('./envelope');
const percentageDiffernce = require('./percentageDiffernce');
const getStandartDeviation = require('./standartDeviation');

module.exports = {
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getOBV,
  getVWAP,
  getEnvelope,
  percentageDiffernce,
  getStandartDeviation,
};
