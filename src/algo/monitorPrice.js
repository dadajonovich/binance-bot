const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '1m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f,
    getValuesForOrder = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f
  ) =>
  async (coin) => {
    try {
      const { pair, stepSize, tickSize } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const { currentPrice } = getPrice(candles);
      const match = pair.match(/^(.*)USDT$/);
      const asset = match[1];
      const { balanceFree: balanceAsset } = await getBalance(client, asset);
      const { balanceFree: balanceUSDT } = await getBalance(client);
      console.log(`${pair} | price: ${currentPrice}`);

      let priceBuyStore;
      let priceSellStore;

      const openOrders = await getOpenOrders(client, pair);

      openOrders.forEach((item) => {
        item.side === 'SELL'
          ? (priceSellStore = item.price)
          : (priceBuyStore = item.price);
      });

      const buyOrderExists = openOrders.some(
        (order) => order.side === 'BUY' && order.status === 'NEW'
      );
      const sellOrderExists = openOrders.some(
        (order) => order.side === 'SELL' && order.status === 'NEW'
      );

      if (!buyOrderExists && !sellOrderExists && balanceAsset < stepSize) {
        console.log('Buy order');
        const { roundedPriceBuy, quantityBuy } = getValuesForOrder(
          currentPrice,
          stepSize,
          tickSize,
          balanceUSDT,
          pair
        );

        priceBuyStore = roundedPriceBuy;
        await createOrder(
          client,
          pair,
          'BUY',
          'LIMIT',
          quantityBuy,
          roundedPriceBuy
        );
      }
      if (!buyOrderExists && !sellOrderExists && balanceAsset > stepSize) {
        console.log('Sell order!');
        console.log(balanceAsset);
        const { roundedPriceSell, quantitySell } = getValuesForOrder(
          currentPrice,
          stepSize,
          tickSize,
          balanceAsset,
          pair
        );
        priceSellStore = roundedPriceSell;
        await createOrder(
          client,
          pair,
          'SELL',
          'LIMIT',
          quantitySell,
          roundedPriceSell
        );
      }
      console.log((currentPrice / priceBuyStore) * 100 > 1);
      console.log((priceSellStore / currentPrice) * 100 > 1);

      if ((priceSellStore / currentPrice) * 100 > 1) {
        cancelOrders(client, openOrders);
      }
    } catch (err) {
      console.error(`Error in monitorPrice`, err);
    }
  };
module.exports = monitorPrice;
