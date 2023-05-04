const getSMA = require('./sma');
const getEMA = require('./ema');
const getMACD = require('./macd');
const getRSI = require('./rsi');
const getVolatility = require('./volatility');
const getOBV = require('./obv');
const percentageDiffernce = require('./percentageDiffernce');

module.exports = {
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getOBV,
  getVolatility,
  percentageDiffernce,
};
