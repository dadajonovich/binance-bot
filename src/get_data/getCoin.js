const getCoin =
  (
    client,
    { intervalToMonitor = '1m', period = 1 } = {},
    getCandles = (f) => f,
    getPrices = (f) => f
  ) =>
  async (pair) => {
    try {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);

      return {
        pair,
        currentPrice: Number(prices.currentPrice),
      };
    } catch (err) {
      console.error('Error in getting coins', err);
      return {};
    }
  };

module.exports = getCoin;
