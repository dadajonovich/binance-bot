const getCoins =
  (
    curryGetCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getStandartDeviation = (f) => f,
    getKeltner = (f) => f,
    getOBV = (f) => f,
    getATR = (f) => f
  ) =>
  async (pairs = []) => {
    try {
      const coins = await Promise.all(
        pairs.map(async (pair) => {
          let candles;
          await new Promise((resolve) => {
            const checkCandles = async () => {
              candles = await curryGetCandles(pair);
              if (candles.length > 0) {
                resolve();
              } else {
                setTimeout(checkCandles, 0.1 * 60 * 1000);
              }
            };
            checkCandles();
          });
          const prices = getPrices(candles);
          const { currentPrice, closePrices, highPrice, lowPrice, volume } =
            prices;
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const sma50 = getSMA(closePrices, 50);
          const sma200 = getSMA(closePrices, 200);
          const keltner = getKeltner(closePrices, highPrice, lowPrice);
          const obv = getOBV(closePrices, volume);
          const atr = getATR(closePrices, highPrice, lowPrice);

          return {
            pair,
            currentPrice,
            candles,
            volatility,
            sma50,
            sma200,
            keltner,
            obv,
            atr,
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
