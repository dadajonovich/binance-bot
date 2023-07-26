const getCoins =
  (
    curryGetCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getStandartDeviation = (f) => f,
    getATR = (f) => f,
    getEMA = (f) => f,
    getKeltner = (f) => f,
    getMACD = (f) => f,
    getMOM = (f) => f,
    getParabolic = (f) => f,
    getOBV = (f) => f,
    getRSI = (f) => f,
    getKAMA = (f) => f
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
          const ma20 = getSMA(closePrices, 20);
          const ma50 = getSMA(closePrices, 50);
          const ma100 = getSMA(closePrices, 100);
          const ma200 = getSMA(closePrices, 200);
          const atr = getATR(closePrices, highPrice, lowPrice, 20);
          const keltner = getKeltner(closePrices, highPrice, lowPrice);
          const obv = getOBV(closePrices, volume);
          const macdVol = getMACD(volume);
          const lineSignalVol = getEMA(macdVol, 9);
          const macd = getMACD(closePrices);
          const lineSignal = getEMA(macd, 9);
          const mom = getMOM(closePrices);
          const parabolic = getParabolic(highPrice, lowPrice);
          const rsi = getRSI(closePrices);
          const { kama, filterKama } = getKAMA(closePrices);

          return {
            pair,
            closePrices,
            candles,
            volatility,
            ma20,
            ma50,
            ma100,
            ma200,
            atr,
            keltner,
            lineSignal,
            macdVol,
            lineSignalVol,
            macd,
            mom,
            parabolic,
            rsi,
            kama,
            filterKama,
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
