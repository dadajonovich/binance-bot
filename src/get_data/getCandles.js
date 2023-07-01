const getCandles =
  (client, { intervalToMonitor = '15m', period = '205' } = {}) =>
  async (pair) => {
    try {
      const candles = await client.candles({
        symbol: pair,
        interval: intervalToMonitor,
        limit: period,
      });
      return candles;
    } catch (err) {
      console.error('Error in getCandles', err);
      return [];
    }
  };

module.exports = getCandles;
