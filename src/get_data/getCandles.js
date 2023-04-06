const getCandles = async (client, pair, intervalToMonitor, period) => {
  const candles = await client.candles({
    symbol: pair,
    interval: intervalToMonitor,
    limit: period + 1,
  });
  return candles;
};

module.exports = getCandles;
