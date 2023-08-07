const tradeAlgo =
  (
    client,
    getBalance = (f) => f,
    getLotParams = (f) => f,
    getOpenOrders = (f) => f,
    orderExist = (f) => f,
    curryCreateBuyOrder = (f) => f,
    curryCreateSellOrder = (f) => f
  ) =>
  async (coins) => {
    try {
      const resultTradeAlgo = await Promise.all(
        coins.map(async (coin) => {
          const { pair } = coin;
          const match = pair.match(/^(.*)USDT$/);
          const asset = match[1];
          const { buyOrderExists, sellOrderExists } = await orderExist(
            client,
            pair,
            getOpenOrders
          );
          let isBuyOrder = false;
          let isSellOrder = false;
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
            isBuyOrder = await curryCreateBuyOrder(
              pair,
              stepSize,
              tickSize,
              quantityUSDT
            );

            if (!isBuyOrder) throw new Error(`isBuyOrder - ${isBuyOrder}`);
            ({ balanceFree: quantityAsset } = await getBalance(client, asset));
          }
          if (quantityAsset > stepSize) {
            isSellOrder = curryCreateSellOrder(pair, asset, stepSize, tickSize);
            if (!isSellOrder) throw new Error(`isSellOrder - ${isSellOrder}`);
          }
          return isSellOrder;
        })
      );
      console.log(resultTradeAlgo);
      return resultTradeAlgo;
    } catch (err) {
      console.error(`Error in tradeAlgo:`, err);
      return [];
    }
  };
module.exports = tradeAlgo;
