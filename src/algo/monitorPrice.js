const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '5m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f,
    getOpenOrders = (f) => f,
    getOrdersMessage = (f) => f
  ) =>
  (trackedCoins = []) => {
    trackedCoins.forEach(async (coin) => {
      const { pair, targetPrice } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      // if (price.currentPrice.toFixed(4) < targetPrice.toFixed(4)) {
      if (true) {
        const { balanceFree } = await getBalance(client);
        const order = await createOrder(
          client,
          pair,
          'BUY',
          'LIMIT',
          balanceFree.toFixed(0),
          targetPrice.toFixed(4)
        );
        getOpenOrders(order);
      } else console.log('U mirin brah?');
    });
  };

module.exports = monitorPrice;
