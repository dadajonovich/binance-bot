const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getKAMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getOBV = (f) => f,
    getVWAP = (f) => f,
    getEnvelope = (f) => f,
    getKeltner = (f) => f,
    getStandartDeviation = (f) => f,
    percentageDiffernce = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '15m', period = 200 } = {}) => {
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
          // const book = await client.book({ symbol: pair, limit: 100 });
          const prices = getPrices(candles);
          const { closePrices, typicalPrices, volumes, highPrice, lowPrice } =
            prices;
          const currentPrice = Number(prices.currentPrice);
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const EMA9 = getEMA(closePrices, 9);
          const EMA20 = getEMA(closePrices, 20);
          const EMA50 = getEMA(closePrices, 50);
          const EMA200 = getEMA(closePrices, 200);
          const { kama, filterKama } = getKAMA(closePrices);
          const MACD = getMACD(closePrices);
          const signalMACD = getEMA(MACD, 9);
          const RSI = getRSI(closePrices);
          const OBV = getOBV(closePrices, volumes);

          const obvEMA9 = getEMA(OBV, 9);
          const obvEMA20 = getEMA(OBV, 20);
          const obvEMA50 = getEMA(OBV, 50);
          const obvEMA200 = getEMA(OBV, 200);
          const VWAP = getVWAP(typicalPrices, volumes);
          const envelope = getEnvelope(closePrices);
          const keltner = getKeltner(closePrices, highPrice, lowPrice);

          const percentDiffVWAP =
            percentageDiffernce(prices.currentPrice, VWAP.at(-1)) * 100;
          const percentDiffEMA9 =
            percentageDiffernce(prices.currentPrice, EMA9.at(-1)) * 100;
          const percentDiffEMA20 =
            percentageDiffernce(prices.currentPrice, EMA20.at(-1)) * 100;
          const percentDiffEMA50 =
            percentageDiffernce(prices.currentPrice, EMA50.at(-1)) * 100;
          const percentDiffEMA200 =
            percentageDiffernce(prices.currentPrice, EMA200.at(-1)) * 100;

          return {
            pair,
            candles,
            closePrices,
            currentPrice,
            volatility,
            EMA9,
            EMA20,
            EMA50,
            EMA200,
            kama,
            filterKama,
            MACD,
            signalMACD,
            RSI,
            OBV,
            obvEMA9,
            obvEMA20,
            obvEMA50,
            obvEMA200,
            VWAP,
            keltner,
            envelope,
            percentDiffEMA9,
            percentDiffEMA20,
            percentDiffEMA50,
            percentDiffEMA200,
            percentDiffVWAP,
          };
        })
      );
      console.log(coins[0].pair, coins[0].kama.at(-1), coins[0].filterKama);
      return coins;
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

module.exports = getCoins;
