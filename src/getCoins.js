const getCandles = require('./getCandles.js');
const getPrices = require('./getPrices.js');
const {
  getSMA,
  getEMA,
  getWMA,
  getVWMA,
  getVWAP,
  getKAMA,
  getMACD,
  getRSI,
  getOBV,
} = require('./ta/indexTA');

const getCriterion = require('./getCriterion.js');

const getCoins = async (client, pairs, intervalToMonitor, period) => {
  const coins = await Promise.all(
    pairs.map(async (pair) => {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);

      const criterion = getCriterion(getMACD(prices), getRSI(prices));

      if (!criterion) return;

      return {
        pair,
        currentPrice: Number(prices.currentPrice.toFixed(2)),
        SMA: getSMA(prices),
        EMA: getEMA(prices),
        WMA: getWMA(prices),
        VWMA: getVWMA(prices),
        VWAP: getVWAP(prices),
        KAMA: getKAMA(prices),
        MACD: getMACD(prices),
        RSI: getRSI(prices),
        OBV: getOBV(prices),
      };
    })
  );
  const filteredCoins = coins.filter((coin) => coin !== undefined);
  return filteredCoins;
};

module.exports = getCoins;
