const client = require('../config');

const getTrackedCoins = (coins = []) => {
  const trackedCoins = coins.map((coin) => ({
    pair: coin.pair,
    currentPrice: coin.currentPrice,
    volatility: coin.volatility,
    targetPrice:
      coin.currentPrice - (coin.currentPrice * coin.volatility) / 100,
  }));
  console.log(trackedCoins);
  return trackedCoins;
};

const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    intervalToMonitor = '4h',
    period = '28'
  ) =>
  (trackedCoins = []) => {
    trackedCoins.forEach(async (coin) => {
      const { pair, targetPrice } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      console.log(price);
    });
  };

const currymonitorPrice = monitorPrice(client);

module.exports = { getTrackedCoins, monitorPrice };
