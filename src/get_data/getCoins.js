const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getKeltner = (f) => f,
    getStandartDeviation = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '15m', period = 25 } = {}) => {
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

          const sma50 = getSMA(closePrices);
          const keltner = getKeltner(closePrices, highPrice, lowPrice);

          return {
            pair,
            candles,
            currentPrice,
            volatility,
            sma50,
            keltner,
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
