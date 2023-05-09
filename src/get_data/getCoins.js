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
    getOBV = (f) => f,
    getVolatility = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '30m', period = 27 } = {}) => {
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
          const volatility = getVolatility(prices);
          const OBV = getOBV(prices);

          return {
            pair,
            currentPrice: Number(prices.currentPrice),
            volatility,
            SMA: getSMA(prices),
            EMA: getEMA(prices),
            VWMA: getVWMA(prices),
            MACD: getMACD(prices.closePrices),
            MACDOBV: getMACD(OBV),
            RSI: getRSI(prices),
            OBV,
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
