const getCandles = require('./getCandles');
const getPrices = require('./getPrices');
const {
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getVolatility,
} = require('../ta/indexTA');

const getCoins = async (client, pairs, intervalToMonitor, period) => {
  const coins = await Promise.all(
    pairs.map(async (pair) => {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);

      return {
        pair,
        currentPrice: Number(prices.currentPrice.toFixed(2)),
        volatility: getVolatility(prices),
        SMA: getSMA(prices),
        EMA: getEMA(prices),
        MACD: getMACD(prices),
        RSI: getRSI(prices),
      };
    })
  );

  const filteredCoins = coins.filter(
    (coin) => coin.volatility >= 5 && coin.SMA.at(-1) < coin.currentPrice
  );

  const sortCoins = filteredCoins.sort((a, b) => b.volatility - a.volatility);

  return sortCoins;
};

module.exports = getCoins;
