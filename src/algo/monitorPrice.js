const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '5m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f,
    getLotSizeParams = (f) => f,
    currySendMessage = (f) => f,
    getValueForOrder = (f) => f
  ) =>
  (trackedCoins = []) => {
    trackedCoins.forEach(async (coin) => {
      const { pair, targetPrice } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      // if (price.currentPrice < targetPrice) {
      if (true) {
        const stepSize = await getLotSizeParams(client, pair);
        const { balanceFree } = await getBalance(client);
        const { roundedPrice, quantity } = getValueForOrder(
          targetPrice,
          stepSize,
          balanceFree
        );
        await createOrder(client, pair, 'BUY', 'LIMIT', quantity, roundedPrice);
        currySendMessage(`Сектор приз... ой блять, ${pair}`);
      } else console.log('U mirin brah?');
    });
  };

module.exports = monitorPrice;
