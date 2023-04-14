const getCandles = async (client, pair, intervalToMonitor, period) => {
  try {
    const candles = await client.candles({
      symbol: pair,
      interval: intervalToMonitor,
      limit: period,
    });
    return candles;
  } catch (err) {
    console.error('Ошибка в запросе свечей', err);
    return [];
  }
};

module.exports = getCandles;
