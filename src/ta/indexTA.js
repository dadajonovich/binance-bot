const getSMA = require('./sma');
const getEMA = require('./ema');
const getWMA = require('./wma');
const getVWMA = require('./vwma');
const getVWAP = require('./vwap');
const getMACD = require('./macd');
const getRSI = require('./rsi');
const getOBV = require('./obv');
const getBELL = require('./bollinger.');
const getVolatility = require('./volatility');

module.exports = {
  getSMA,
  getEMA,
  getWMA,
  getVWMA,
  getVWAP,
  getMACD,
  getRSI,
  getOBV,
  getBELL,
  getVolatility,
};
