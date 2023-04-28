const getCoins =
  (
    client,
    { intervalToMonitor = '4h', period = 28 } = {},
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getVolatility = (f) => f
  ) =>
  async (pairs = []) => {
    const coins = await Promise.all(
      pairs.map(async (pair) => {
        const candles = await getCandles(
          client,
          pair,
          intervalToMonitor,
          period
        );
        const prices = getPrices(candles);

        return {
          pair,
          currentPrice: Number(prices.currentPrice),
          volatility: getVolatility(prices),
          SMA: getSMA(prices),
          EMA: getEMA(prices),
          MACD: getMACD(prices),
          RSI: getRSI(prices),
        };
      })
    );
    const filteredCoins = coins.filter(
      (coin) => coin.volatility >= 3 && coin.SMA.at(-1) < coin.currentPrice
    );

    const sortCoins = filteredCoins.sort((a, b) => b.volatility - a.volatility);
    return sortCoins;
  };

module.exports = getCoins;
