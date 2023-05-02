const getCoins =
  (
    client,
    { intervalToMonitor = '1m', period = 28 } = {},
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getVolatility = (f) => f
  ) =>
  async (pairs = []) => {
    try {
      console.log(`${intervalToMonitor}, ${period}`);
      const coins = await Promise.all(
        pairs.map(async (pair) => {
          const candles = await getCandles(
            client,
            pair,
            intervalToMonitor,
            period
          );
          const prices = getPrices(candles);
          const { volatility, standartDeviation } = getVolatility(prices);

          return {
            pair,
            currentPrice: Number(prices.currentPrice),
            volatility,
            standartDeviation,
            SMA: getSMA(prices),
            EMA: getEMA(prices),
            MACD: getMACD(prices),
            RSI: getRSI(prices),
          };
        })
      );
      const filteredCoins = coins.filter(
        (coin) => coin.MACD.at(-1) > 0 && coin.MACD.at(-2) < 0
      );

      const sortCoins = filteredCoins.sort(
        (a, b) => b.MACD.at(-1) - a.MACD.at(-1)
      );

      return filteredCoins.slice(0, 1);
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

module.exports = getCoins;
