const getCandles = require('./getCandles');
const getPrices = require('./getPrices');
const {
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
} = require('../ta/indexTA');

const getCriterion = require('./getCriterion');

const getCoins = async (client, pairs, intervalToMonitor, period) => {
  const coins = await Promise.all(
    pairs.map(async (pair) => {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);
      const volatility = getVolatility(prices);

      // const criterion = getCriterion(
      //   getSMA(prices),
      //   getMACD(prices),
      //   getRSI(prices),
      //   getBELL(prices),
      //   prices
      // );

      // // if (!criterion) return;

      if (volatility < 5) return undefined;

      return {
        pair,
        volatility,
        currentPrice: Number(prices.currentPrice.toFixed(2)),
        SMA: getSMA(prices),
        EMA: getEMA(prices),
        WMA: getWMA(prices),
        VWMA: getVWMA(prices),
        VWAP: getVWAP(prices),
        MACD: getMACD(prices),
        RSI: getRSI(prices),
        OBV: getOBV(prices),
        BELL: getBELL(prices),
      };
    })
  );
  const filteredCoins = coins.filter((coin) => coin !== undefined);
  return filteredCoins;
};

module.exports = getCoins;
