const createBuyOrder =
  (
    client,
    getValuesForOrder = (f) => f,
    createOrder = (f) => f,
    orderExist = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f
  ) =>
  async (pair, stepSize, tickSize, quantityUSDT) => {
    try {
      console.log('Buy order');

      let isBuyOrder = false;
      let count = 0;
      console.log(`count from createBuyOrder ${count}`);

      const composeCreateBuyOrder = async () => {
        const { [pair]: price } = await client.prices({ symbol: pair });
        const { roundedPrice, quantityBuy } = getValuesForOrder(
          Number(price),
          stepSize,
          tickSize,
          quantityUSDT,
          pair
        );
        await createOrder(
          client,
          pair,
          'BUY',
          'LIMIT',
          quantityBuy,
          roundedPrice
        );
      };

      await composeCreateBuyOrder();

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
            await composeCreateBuyOrder();
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
