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
  async (pairs = [], { intervalToMonitor = '4h', period = 40 } = {}) => {
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
          const SMA = getSMA(closePrices);
          const EMA = getEMA(closePrices);
          const HULL = getHULL(closePrices);
          const MACD = getMACD(closePrices);
          const signalMACD = getEMA(MACD, 9);
          const RSI = getRSI(closePrices);
          const OBV = getOBV(closePrices, volumes);
          const percentDiffEMA =
            percentageDiffernce(prices.currentPrice, EMA.at(-1)) * 100;
          const percentDiffSMA =
            percentageDiffernce(prices.currentPrice, SMA.at(-1)) * 100;
          const percentDiffHULL =
            percentageDiffernce(prices.currentPrice, HULL.at(-1)) * 100;

          return {
            pair,
            candles,
            closePrices,
            openPrices,
            currentPrice,
            volatility,
            SMA,
            EMA,
            HULL,
            MACD,
            signalMACD,
            RSI,
            OBV,
            percentDiffSMA,
            percentDiffEMA,
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
