const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '1m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f,
    getValuesForOrder = (f) => f,
    getOpenOrders = (f) => f
  ) =>
  async (coin) => {
    try {
      const { pair, stepSize, tickSize } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      const match = pair.match(/^(.*)USDT$/);
      const asset = match[1];
      const { balanceFree: balanceAsset } = await getBalance(client, asset);
      const { balanceFree: balanceUSDT } = await getBalance(client);
      console.log(`${pair} | price: ${price.currentPrice}`);

      // if (true) {
      const openOrders = await getOpenOrders(client, pair);

      const buyOrderExists = openOrders.some(
        (order) => order.side === 'BUY' && order.status === 'NEW'
      );
      const sellOrderExists = openOrders.some(
        (order) => order.side === 'SELL' && order.status === 'NEW'
      );

      if (
        !buyOrderExists &&
        !sellOrderExists &&
        balanceAsset < balanceAsset * 0.05
      ) {
        console.log('Buy order');
        const { roundedPriceBuy, quantityBuy } = getValuesForOrder(
          price.currentPrice,
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
          quantityBuy,
          roundedPriceBuy
        );
      }
      if (
        !buyOrderExists &&
        !sellOrderExists &&
        balanceAsset > balanceAsset * 0.05
      ) {
        console.log('Sell order!');
        console.log(balanceAsset);
        const { roundedPriceSell, quantitySell } = getValuesForOrder(
          price.currentPrice,
          stepSize,
          tickSize,
          balanceAsset,
          pair
        );
        await createOrder(
          client,
          pair,
          'SELL',
          'LIMIT',
          quantitySell,
          roundedPriceSell
        );
      }
    } catch (err) {
      console.error(`Error in monitorPrice`, err);
    }
  };
module.exports = monitorPrice;
