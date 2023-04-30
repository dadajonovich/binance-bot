const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '5m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f,
    getValuesForOrder = (f) => f,
    getOpenOrders = (f) => f
  ) =>
  (trackedCoins = []) => {
    trackedCoins.forEach(async (coin) => {
      const { pair, targetPrice, stepSize, tickSize } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      const match = pair.match(/^(.*)USDT$/);
      const asset = match[1];
      const { balanceFree: balanceAsset } = await getBalance(client, asset);
      const { balanceFree: balanceUSDT } = await getBalance(client);
      console.log(`${pair}-${price.currentPrice} | target:${targetPrice}`);

      if (price.currentPrice < targetPrice) {
        // if (true) {
        const openOrders = await getOpenOrders(client, pair);

        const buyOrderExists = openOrders.some(
          (order) => order.side === 'BUY' && order.status === 'NEW'
        );
        const sellOrderExists = openOrders.some(
          (order) => order.side === 'SELL' && order.status === 'NEW'
        );

        if (!buyOrderExists && !sellOrderExists && balanceAsset === 0) {
          const { roundedPriceBuy, quantity } = getValuesForOrder(
            targetPrice,
            stepSize,
            tickSize,
            balanceUSDT,
            pair
          );
          await createOrder(
            client,
            pair,
            'BUY',
            'LIMIT',
            quantity,
            roundedPriceBuy
          );
        }
        if (!buyOrderExists && !sellOrderExists && balanceAsset > 0) {
          const { roundedPriceSell } = getValuesForOrder(
            targetPrice,
            stepSize,
            tickSize,
            balanceUSDT,
            pair
          );
          await createOrder(
            client,
            pair,
            'SELL',
            'LIMIT',
            balanceAsset,
            roundedPriceSell
          );
        }
      }
    });
  };

module.exports = monitorPrice;
