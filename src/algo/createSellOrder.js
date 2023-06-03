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
    const takeProfit = null;
    let stopLoss = null;
    let count = 0;
    let { [pair]: price } = await client.prices({ symbol: pair });

    if (stopLoss === null) {
      stopLoss = price - price * 0.015;
    }

    // if (takeProfit === null) {
    //   takeProfit = price * (1 + 3 / 100);
    // }

    await new Promise((resolve) => {
      const checkSellCriterionInterval = setInterval(async () => {
        console.log('tick checkSellCriterionInterval...');
        const [{ candles, envelope, keltner }] = await curryGetCoins([pair]);

        // Envelope
        // const [secondUpperLine, secondMiddleLine, secondLowerLine] =
        //   envelope.at(-2);
        // const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
        //   envelope.at(-3);
        // const crossUpperLine = candles.at(-2).open > secondMiddleLine;
        // const firstCriterionSell = crossUpperLine;

        // Kelter;
        const [secondUpperLine, secondMiddleLine, secondLowerLine] =
          keltner.at(-2);
        const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
          keltner.at(-3);
        const crossUpperLine = candles.at(-2).open > secondMiddleLine;
        const firstCriterionSell = crossUpperLine;

        console.log(firstCriterionSell);
        if (firstCriterionSell) {
          ({ [pair]: price } = await client.prices({ symbol: pair }));
          const { roundedPriceSell, quantitySell } = getValuesForOrder(
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
            roundedPriceSell
          );

          clearInterval(checkSellCriterionInterval);
          resolve();
        }
      }, 0.5 * 60 * 1000);
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
          ({ [pair]: price } = await client.prices({ symbol: pair }));
          const { roundedPriceSell, quantitySell } = getValuesForOrder(
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
            roundedPriceSell
          );
          count = 0;
        }
      }, 5 * 1000);
    });

    return isSellOrder;
  } catch (err) {
    console.error(`Error in createSellOrder`, err);
    return false;
  }
};

module.exports = createSellOrder;
