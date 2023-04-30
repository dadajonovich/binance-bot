const getCoin =
  (
    client,
    { intervalToMonitor = '1m', period = 1 } = {},
    getCandles = (f) => f,
    getPrices = (f) => f,
    getLotParams = (f) => f
  ) =>
  async (pair) => {
    try {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);
      const { stepSize, tickSize } = await getLotParams(client, pair);

      return {
        pair,
        currentPrice: Number(prices.currentPrice),
        stepSize,
        tickSize,
      };
    } catch (err) {
      console.error('Error in getting coins', err);
      return {};
    }
  };

module.exports = getCoin;
