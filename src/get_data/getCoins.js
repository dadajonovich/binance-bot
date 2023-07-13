const getCoins =
  (
    curryGetCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getStandartDeviation = (f) => f,
    getKeltner = (f) => f,
    getEnvelope = (f) => f,
    getATR = (f) => f,
    getEMA = (f) => f,
    getMACD = (f) => f
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
          const envelope = getEnvelope(closePrices);
          const atr = getATR(closePrices, highPrice, lowPrice, 20);
          const volOsc = getMACD(volume, 20, 50);
          const ema3 = getEMA(closePrices, 3);
          const macd = getMACD(closePrices);
          const signalMacd = getEMA(macd, 9);

          return {
            pair,
            currentPrice,
            candles,
            volatility,
            sma50,
            sma200,
            keltner,
            envelope,
            atr,
            volOsc,
            macd,
            signalMacd,
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
