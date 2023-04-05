const getCandles = require('./getCandles.js');
const getPrices = require('./getPrices.js');
const {
  getSMA,
  getEMA,
  getWMA,
  getVWMA,
  getVWAP,
  getHull,
  getLSMA,
  getKAMA,
  getWSMA,
  getHWMA,
  getPWMA,
  getMACD,
  getRSI,
  getBOP,
} = require('./ta/indexTA');

const getCriterion = require('./getCriterion.js');

const getCoins = async (client, pairs, intervalToMonitor, period) => {
  const coins = await Promise.all(
    pairs.map(async (pair) => {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);

      const criterion = getCriterion(getMACD(prices));

      if (!criterion) return;

      return {
        pair,
        currentPrice: Number(prices.currentPrice.toFixed(2)),
        SMA: getSMA(prices),
        EMA: getEMA(prices),
        WMA: getWMA(prices),
        VWMA: getVWMA(prices),
        Hull: getHull(prices),
        LSMA: getLSMA(prices),
        KAMA: getKAMA(prices),
        WSMA: getWSMA(prices),
        HWMA: getHWMA(prices),
        PWMA: getPWMA(prices),
        VWAP: getVWAP(prices),
        MACD: getMACD(prices),
        RSI: getRSI(prices),
        BOP: getBOP(prices),
      };
    })
  );
  const filteredCoins = coins.filter((coin) => coin !== undefined);
  return filteredCoins;
};

module.exports = getCoins;
