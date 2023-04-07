const getSMA = require('./sma.js');
const getEMA = require('./ema.js');
const getWMA = require('./wma.js');
const getVWMA = require('./vwma.js');
const getVWAP = require('./vwap.js');
const getMACD = require('./macd.js');
const getRSI = require('./rsi.js');
const getOBV = require('./obv.js');
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
