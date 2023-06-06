const createSellOrder = async (
  client,
  pair,
  stepSize,
  tickSize,
  quantityAsset,
  curryGetCoins = (f) => f,
  getValuesForOrder = (f) => f,
  createOrder = (f) => f,
  orderExist = (f) => f,
  getOpenOrders = (f) => f,
  cancelOrders = (f) => f
) => {
  try {
    console.log('Sell order!');

    let isSellOrder = false;
    let takeProfit = null;
    let stopLoss = null;
    let count = 0;
    let { [pair]: price } = await client.prices({ symbol: pair });

    const composeCreateSellOrder = async () => {
      ({ [pair]: price } = await client.prices({ symbol: pair }));
      const { roundedPrice, quantitySell } = getValuesForOrder(
        Number(price),
        stepSize,
        tickSize,
        quantityAsset,
        pair
      );
      await createOrder(
        client,
        pair,
        'SELL',
        'LIMIT',
        quantitySell,
        roundedPrice
      );
    };

    await new Promise((resolve) => {
      const checkSellCriterionInterval = setInterval(async () => {
        console.log('tick checkSellCriterionInterval...');
        const [{ candles, envelope, keltner, volatility }] =
          await curryGetCoins([pair]);
        ({ [pair]: price } = await client.prices({ symbol: pair }));

        if (stopLoss === null) {
          stopLoss = price - price * 0.01;
        }

        if (takeProfit === null) {
          takeProfit = price * (1 + volatility / 100);
        }

        // Kelter;
        const [secondUpperLine, secondMiddleLine, secondLowerLine] =
          keltner.at(-2);
        const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
          keltner.at(-3);
        const crossUpperLine = candles.at(-2).open > secondMiddleLine;
        const firstCriterionSell = takeProfit < price;
        // const firstCriterionSell = crossUpperLine;

        console.log(firstCriterionSell);
        if (firstCriterionSell) {
          await composeCreateSellOrder();
          clearInterval(checkSellCriterionInterval);
          resolve();
        }
      }, 1 * 60 * 1000);
    });

    await new Promise((resolve) => {
      const checkSellInterval = setInterval(async () => {
        console.log('tick checkSellInterval...');
        const { sellOrderExists: sellMark } = await orderExist(
          client,
          pair,
          getOpenOrders
        );
        count += 1;
        if (!sellMark) {
          isSellOrder = true;
          clearInterval(checkSellInterval);
          resolve();
        }
        if (count > 5) {
          const orders = await getOpenOrders(client);
          await cancelOrders(client, orders);
          await composeCreateSellOrder();
          count = 0;
        }
      }, 0.5 * 60 * 1000);
    });

    return isSellOrder;
  } catch (err) {
    console.error(`Error in createSellOrder`, err);
    return false;
  }
};

module.exports = createSellOrder;
