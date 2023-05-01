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
    getVolatility = (f) => f,
    getLotParams = (f) => f
  ) =>
  async (pairs = []) => {
    try {
      const coins = await Promise.all(
        pairs.map(async (pair) => {
          const candles = await getCandles(
            client,
            pair,
            intervalToMonitor,
            period
          );
          const prices = getPrices(candles);
          const { stepSize, tickSize } = await getLotParams(client, pair);

          return {
            pair,
            currentPrice: Number(prices.currentPrice),
            volatility: getVolatility(prices),
            SMA: getSMA(prices),
            EMA: getEMA(prices),
            MACD: getMACD(prices),
            RSI: getRSI(prices),
            stepSize,
            tickSize,
          };
        })
      );
      const filteredCoins = coins.filter(
        (coin) => coin.SMA.at(-1) < coin.currentPrice
      );

      const sortCoins = filteredCoins.sort(
        (a, b) => b.volatility - a.volatility
      );
      return sortCoins;
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

module.exports = getCoins;
