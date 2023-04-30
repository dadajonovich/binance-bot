const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '5m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f,
    currySendMessage = (f) => f,
    getValuesForOrder = (f) => f
  ) =>
  (trackedCoins = []) => {
    trackedCoins.forEach(async (coin) => {
      const { pair, targetPrice, stepSize, tickSize } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      // if (price.currentPrice < targetPrice) {
      if (true) {
        await currySendMessage(`Сектор приз... ой блять, ${pair}`);

        const { balanceFree } = await getBalance(client);
        const { roundedPrice, quantity } = getValuesForOrder(
          targetPrice,
          stepSize,
          tickSize,
          balanceFree,
          pair
        );
        await createOrder(client, pair, 'BUY', 'LIMIT', quantity, roundedPrice);
      } else console.log('U mirin brah?');
    });
  };

module.exports = monitorPrice;
