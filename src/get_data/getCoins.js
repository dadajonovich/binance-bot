const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getHULL = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getOBV = (f) => f,
    getStandartDeviation = (f) => f,
    percentageDiffernce = (f) => f
  ) =>
  async (pairs = [], { intervalToMonitor = '1d', period = 40 } = {}) => {
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
          const { closePrices, openPrices, volumes } = prices;
          const currentPrice = Number(prices.currentPrice);
          const standartDeviation = getStandartDeviation(closePrices);
          const volatility = (standartDeviation / currentPrice) * 100;
          const EMA8 = getEMA(closePrices, 8);
          const EMA21 = getEMA(closePrices, 21);
          const HULL = getHULL(closePrices);
          const MACD = getMACD(closePrices);
          const signalMACD = getEMA(MACD, 9);
          const RSI = getRSI(closePrices);

          const OBV = getOBV(closePrices, volumes);

          const percentDiffEMA8 =
            percentageDiffernce(prices.currentPrice, EMA8.at(-1)) * 100;
          const percentDiffEMA21 =
            percentageDiffernce(prices.currentPrice, EMA21.at(-1)) * 100;
          const percentDiffHULL =
            percentageDiffernce(prices.currentPrice, HULL.at(-1)) * 100;

          return {
            pair,
            candles,
            closePrices,
            openPrices,
            currentPrice,
            volatility,
            EMA8,
            EMA21,
            HULL,
            MACD,
            signalMACD,
            RSI,
            OBV,
            percentDiffEMA8,
            percentDiffEMA21,
            percentDiffHULL,
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
