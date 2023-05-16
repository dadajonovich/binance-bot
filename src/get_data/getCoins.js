const getCoins =
  (
    client,
    getCandles = (f) => f,
    getPrices = (f) => f,
    getSMA = (f) => f,
    getEMA = (f) => f,
    getVWMA = (f) => f,
    getMACD = (f) => f,
    getRSI = (f) => f,
    getOBV = (f) => f,
    getStandartDeviation = (f) => f,
    getWilliams = (f) => f,
    getBollinger = (f) => f,
    getMOM = (f) => f,
    getFIB = (f) => f,
    percentageDiffernce = (f) => f,
    getHull = (f) => f,
    getKaufman = (f) => f
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
          const SMA = getSMA(prices);
          const EMA = getEMA(prices.closePrices);
          const standartDeviation = getStandartDeviation(prices);
          const volatility = (standartDeviation / EMA.at(-1)) * 100;
          const MOM = getMOM(prices.closePrices);
          const OBV = getOBV(prices);
          const BOLL = getBollinger(prices);
          const [upperLine, middleLine, lowerLine] = BOLL.at(-1);
          const percentBandwidth = ((upperLine - lowerLine) / middleLine) * 100;
          const MACD = getMACD(prices.closePrices);
          const signalMACD = getEMA(MACD, 9);
          const percentDiffEMA =
            percentageDiffernce(prices.currentPrice, EMA.at(-1)) * 100;

          const maxPrice = Math.max(...prices.closePrices);
          const minPrice = Math.min(...prices.closePrices);
          // const startPrice = prices.closePrices.at(0);
          // const endPrice = prices.closePrices.at(-1);
          const FIB = getFIB(maxPrice, minPrice);
          const goalFIB = FIB.at(5);
          const KAMA = getKaufman(prices.closePrices);
          const percentDiffKAMA =
            percentageDiffernce(prices.currentPrice, KAMA.at(-1)) * 100;
          const HULL = getHull(prices.closePrices);
          const percentDiffHULL =
            percentageDiffernce(prices.currentPrice, HULL.at(-1)) * 100;

          return {
            pair,
            currentPrice: Number(prices.currentPrice),
            percentDiffEMA,
            percentDiffKAMA,
            percentDiffHULL,
            minPrice,
            maxPrice,
            penultimateCurrentPrice: Number(prices.penultimateCurrentPrice),
            volatility,
            MOM,
            williams: getWilliams(prices),
            FIB,
            goalFIB,
            SMA,
            EMA,
            VWMA: getVWMA(prices),
            KAMA,
            HULL,
            MACD,
            signalMACD,
            MACDOBV: getMACD(OBV),
            RSI: getRSI(prices),
            OBV,
            BOLL,
            percentBandwidth,
            upperLine,
            middleLine,
            lowerLine,
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
