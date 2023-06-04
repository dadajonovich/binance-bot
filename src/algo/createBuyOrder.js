const createBuyOrder = async (
  client,
  pair,
  stepSize,
  tickSize,
  quantityUSDT,
  getValuesForOrder = (f) => f,
  createOrder = (f) => f,
  orderExist = (f) => f,
  getOpenOrders = (f) => f,
  cancelOrders = (f) => f
) => {
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
      const checkBuyInterval = setInterval(async () => {
        console.log('tick checkBuyInterval...');
        const { buyOrderExists: buyMark } = await orderExist(
          client,
          pair,
          getOpenOrders
        );
        count += 1;
        if (!buyMark) {
          isBuyOrder = true;
          clearInterval(checkBuyInterval);
          resolve();
        }
        if (count > 5) {
          const orders = await getOpenOrders(client);
          await cancelOrders(client, orders);
          await composeCreateBuyOrder();
          count = 0;
        }
      }, 0.5 * 60 * 1000);
    });

    return isBuyOrder;
  } catch (err) {
    console.error(`Error in createBuyOrder`, err);
    return false;
  }
};

module.exports = createBuyOrder;
