const getCandles = async (client, pair, intervalToMonitor, period) => {
  try {
    const candles = await client.candles({
      symbol: pair,
      interval: intervalToMonitor,
      limit: period,
    });
    return candles;
  } catch (err) {
    if (err.message === 'fetch failed') {
      getCandles(client, pair, intervalToMonitor, period);
    }
    console.error('Error in getCandles', err);
    return [];
  }
};

module.exports = getCandles;
