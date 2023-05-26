const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getOBV = (f) => f,
    getVWAP = (f) => f,
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
          const prices = getPrices(candles);
          const { closePrices, typicalPrices, volumes } = prices;
          const currentPrice = Number(prices.currentPrice);
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const EMA9 = getEMA(closePrices, 9);
          const EMA20 = getEMA(closePrices, 20);
          const EMA50 = getEMA(closePrices, 50);
          const EMA200 = getEMA(closePrices, 200);
          const MACD = getMACD(closePrices);
          const signalMACD = getEMA(MACD, 9);
          const RSI = getRSI(closePrices);

          const OBV = getOBV(closePrices, volumes);
          const VWAP = getVWAP(typicalPrices, volumes);
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
            MACD,
            signalMACD,
            RSI,
            OBV,
            VWAP,
            percentDiffEMA9,
            percentDiffEMA20,
            percentDiffEMA50,
            percentDiffEMA200,
            percentDiffVWAP,
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
