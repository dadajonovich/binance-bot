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
      if (err.message === 'fetch failed') {
        console.log('Oh shit, get candles again...');
        return getCandles(client, { intervalToMonitor, period })(pair);
      }
      console.error('Error in getCandles', err);
      return [];
    }
  };

module.exports = getCandles;
