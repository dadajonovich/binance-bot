const createBuyOrder =
  (
    client,
    orderExist = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f,
    curryComposeCreateOrder = (f) => f,
    getBalance = (f) => f
  ) =>
  async (pair, stepSize, tickSize, quantityUSDT) => {
    try {
      console.log('Buy order');

      let isBuyOrder = false;
      let count = 0;

      await curryComposeCreateOrder(
        pair,
        quantityUSDT,
        stepSize,
        tickSize,
        'BUY'
      );

      await new Promise((resolve) => {
        const checkBuyInterval = async () => {
          console.log('tick checkBuyInterval...');
          const { buyOrderExists: buyMark } = await orderExist(
            client,
            pair,
            getOpenOrders
          );
          count += 1;
          if (!buyMark) {
            isBuyOrder = true;
            resolve();
          } else if (count > 5) {
            const orders = await getOpenOrders(client);
            await cancelOrders(client, orders);
            const { balanceFree: newQuantityUSDT } = await getBalance(
              client,
              'USDT'
            );
            await curryComposeCreateOrder(
              pair,
              newQuantityUSDT,
              stepSize,
              tickSize,
              'BUY'
            );
            count = 0;
            setTimeout(checkBuyInterval, 0.25 * 60 * 1000);
          } else {
            setTimeout(checkBuyInterval, 0.25 * 60 * 1000);
          }
        };
        checkBuyInterval();
      });

      return isBuyOrder;
    } catch (err) {
      console.error(`Error in createBuyOrder`, err);
      return false;
    }
  };

module.exports = createBuyOrder;
