const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getVWMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getOBV = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '5m', period = 28 } = {}) => {
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

          return {
            pair,
            currentPrice: Number(prices.currentPrice),
            SMA: getSMA(prices),
            EMA: getEMA(prices),
            VWMA: getVWMA(prices),
            MACD: getMACD(prices),
            RSI: getRSI(prices),
            OBV: getOBV(prices),
          };
        })
      );

      return coins;
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

module.exports = getCoins;
