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
    createSellOrder = (f) => f
  ) =>
  async (coins) => {
    try {
      coins.forEach(async (coin) => {
        const { pair } = coin;
        const match = pair.match(/^(.*)USDT$/);
        const asset = match[1];
        const { buyOrderExists, sellOrderExists } = await orderExist(
          client,
          pair,
          getOpenOrders
        );

        let { balanceFree: quantityAsset } = await getBalance(client, asset);
        let { balanceFree: quantityUSDT } = await getBalance(client, 'USDT');
        const { stepSize, tickSize } = await getLotParams(client, pair);

        let isBuyOrder = false;
        let isSellOrder = false;

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
            getOpenOrders
          );

          if (!isBuyOrder) return;
          ({ balanceFree: quantityAsset } = await getBalance(client, asset));
          console.log(quantityAsset);
        }

        if (quantityAsset > stepSize) {
          createSellOrder(
            client,
            pair,
            stepSize,
            tickSize,
            quantityAsset,
            curryGetCoins,
            getValuesForOrder,
            createOrder
          );
        }
      });
    } catch (err) {
      console.error(`Error in monitorPrice`, err);
    }
  };
module.exports = monitorPrice;
