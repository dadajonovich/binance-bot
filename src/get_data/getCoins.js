const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getStandartDeviation = (f) => f,
    getFIB = (f) => f,
    getRSI = (f) => f,
    checkMinimumsIncrease = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '15m', period = 205 } = {}) => {
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
          const { closePrices, highPrice, lowPrice } = prices;
          const currentPrice = Number(prices.currentPrice);
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const maxPrice = Math.max(...prices.closePrices);
          const minPrice = Math.min(...prices.closePrices);
          const fibonacci = getFIB(minPrice, maxPrice);
          const lineBottom = fibonacci[4];
          const lineTop = fibonacci[6];
          const rsi = getRSI(closePrices);
          const sma200 = getSMA(closePrices, 200);
          const trend = checkMinimumsIncrease(closePrices, 5);

          return {
            pair,
            currentPrice,
            candles,
            volatility,
            sma200,
            lineBottom,
            lineTop,
            rsi,
            trend,
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
