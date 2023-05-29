const getSMA = require('./sma');
const getEMA = require('./ema');
const getKAMA = require('./kaufman');
const getMACD = require('./macd');
const getRSI = require('./rsi');
const getOBV = require('./obv');
const getVWAP = require('./vwap');
const getEnvelope = require('./envelope');
const getKeltner = require('./keltner');
const percentageDiffernce = require('./percentageDiffernce');
const getStandartDeviation = require('./standartDeviation');

module.exports = {
  getSMA,
  getEMA,
  getKAMA,
  getMACD,
  getRSI,
  getOBV,
  getVWAP,
  getEnvelope,
  getKeltner,
  percentageDiffernce,
  getStandartDeviation,
};
