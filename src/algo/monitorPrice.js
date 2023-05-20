const monitorPrice =
  (
    client,
    createOrder = (f) => f,
    getBalance = (f) => f,
    getLotParams = (f) => f,
    getValuesForOrder = (f) => f,
    getOpenOrders = (f) => f,
    orderExist = (f) => f,
    curryGetCoins = (f) => f,
    createBuyOrder = (f) => f,
    createSellOrder = (f) => f,
    cancelOrders = (f) => f
  ) =>
  async (coins) => {
    try {
      const resultMonitor = await Promise.all(
        coins.map(async (coin) => {
          const { pair } = coin;
          const match = pair.match(/^(.*)USDT$/);
          const asset = match[1];
          const { buyOrderExists, sellOrderExists } = await orderExist(
            client,
            pair,
            getOpenOrders
          );
          let isBuyOrder;
          let isSellOrder;
          const { balanceFree: quantityUSDT } = await getBalance(
            client,
            'USDT'
          );
          let { balanceFree: quantityAsset } = await getBalance(client, asset);
          const { stepSize, tickSize } = await getLotParams(client, pair);

          if (
            quantityUSDT > 10 &&
            !buyOrderExists &&
            !sellOrderExists &&
            quantityAsset < stepSize
          ) {
            isBuyOrder = await createBuyOrder(
              client,
              pair,
              stepSize,
              tickSize,
              quantityUSDT,
              getValuesForOrder,
              createOrder,
              orderExist,
              getOpenOrders,
              cancelOrders
            );

            if (!isBuyOrder) throw new Error(`isBuyOrder - ${isBuyOrder}`);
            ({ balanceFree: quantityAsset } = await getBalance(client, asset));
          }

          if (quantityAsset > stepSize) {
            isSellOrder = createSellOrder(
              client,
              pair,
              stepSize,
              tickSize,
              quantityAsset,
              curryGetCoins,
              getValuesForOrder,
              createOrder
            );
            if (!isSellOrder) throw new Error(`isSellOrder - ${isSellOrder}`);
          }
          return isSellOrder;
        })
      );
      console.log(resultMonitor);
      return resultMonitor;
    } catch (err) {
      console.error(`Error in monitorPrice:`, err);
      return [];
    }
  };
module.exports = monitorPrice;
