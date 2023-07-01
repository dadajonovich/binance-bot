const getCoins =
  (
    curryGetCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getStandartDeviation = (f) => f,
    getKeltner = (f) => f,
    getOBV = (f) => f
  ) =>
  async (pairs = []) => {
    try {
      const coins = await Promise.all(
        pairs.map(async (pair) => {
          const candles = await curryGetCandles(pair);
          const prices = getPrices(candles);
          const { currentPrice, closePrices, highPrice, lowPrice, volume } =
            prices;
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const sma50 = getSMA(closePrices, 50);
          const sma200 = getSMA(closePrices, 200);
          const keltner = getKeltner(closePrices, highPrice, lowPrice);
          const obv = getOBV(closePrices, volume);

          return {
            pair,
            currentPrice,
            candles,
            volatility,
            sma50,
            sma200,
            keltner,
            obv,
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
