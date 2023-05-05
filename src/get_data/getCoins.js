const getCoins =
  (
    client,
    { intervalToMonitor = '1m', period = 28 } = {},
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getVWMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getOBV = (f) => f,
    getVolatility = (f) => f,
    percentageDiffernce = (f) => f
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
            VWMA: getVWMA(prices),
            MACD: getMACD(prices),
            RSI: getRSI(prices),
            OBV: getOBV(prices),
          };
        })
      );
      const filteredCoins = coins.filter(
        (coin) => coin.MACD.at(-1) > 0 && coin.MACD.at(-2) < 0
        // coin.obvMACD.at(-1) > 0 &&
        // coin.obvMACD.at(-2) < 0 &&
        // coin.volatility > 1
        // percentageDiffernce(coin.currentPrice, coin.VWMA.at(-1)) > 0.03 &&
        // coin.OBV.at(-1) > coin.OBV.at(-2)
      );

      return filteredCoins;
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

module.exports = getCoins;
