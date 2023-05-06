const createBuyOrder = async (
  client,
  pair,
  stepSize,
  tickSize,
  quantityUSDT,
  getValuesForOrder = (f) => f,
  createOrder = (f) => f,
  orderExist = (f) => f,
  getOpenOrders = (f) => f
) => {
  try {
    console.log('Buy order');

    let isBuyOrder = false;

    const { [pair]: price } = await client.prices({ symbol: pair });
    const { roundedPriceBuy, quantityBuy } = getValuesForOrder(
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
      'MARKET',
      quantityBuy,
      roundedPriceBuy
    );

    await new Promise((resolve) => {
      const checkBuyInterval = setInterval(async () => {
        console.log('tick checkBuyInterval...');
        const { buyOrderExists: buyMark } = await orderExist(
          client,
          pair,
          getOpenOrders
        );
        if (!buyMark) {
          isBuyOrder = true;
          clearInterval(checkBuyInterval);
          resolve();
        }
      }, 15 * 1000);
    });

    return isBuyOrder;
  } catch (err) {
    console.error(`Error in createBuyOrder`, err);
    return false;
  }
};

module.exports = createBuyOrder;
