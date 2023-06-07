const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getKeltner = (f) => f,
    getEnvelope = (f) => f,
    getStandartDeviation = (f) => f,
    getSMA = (f) => f,
    getFIB = (f) => f,
    getRSI = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '4h', period = 30 } = {}) => {
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
          const { closePrices, highPrice, lowPrice, rangeCandlePercent } =
            prices;
          const currentPrice = Number(prices.currentPrice);
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const keltner = getKeltner(closePrices, highPrice, lowPrice);
          const envelope = getEnvelope(closePrices);
          const averageRangeCandle = getSMA(rangeCandlePercent, 5);

          const maxPrice = Math.max(...prices.closePrices);
          const minPrice = Math.min(...prices.closePrices);
          const fibonacci = getFIB(minPrice, maxPrice);
          const lineBottom = fibonacci[2];
          const lineTop = fibonacci[4];
          const rsi = getRSI(closePrices);

          return {
            pair,
            candles,
            currentPrice,
            volatility,
            keltner,
            envelope,
            rangeCandlePercent,
            averageRangeCandle,
            lineBottom,
            lineTop,
            rsi,
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
