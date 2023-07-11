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
    let count = 0;
    let price;
    let stopLoss = null;
    let takeProfit = null;

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

    const [{ candles, keltner, envelope, atr }] = await curryGetCoins([pair]);
    const [secondUpperLine, secondMiddleLine, secondLowerLine] = keltner.at(-2);
    // const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    //   envelope.at(-2);

    await new Promise((resolve) => {
      const checkSellCriterionInterval = setInterval(async () => {
        console.log('tick checkSellCriterionInterval...');
        ({ [pair]: price } = await client.prices({ symbol: pair }));

        if (stopLoss === null) {
          stopLoss = secondMiddleLine;
        }

        if (takeProfit === null) {
          takeProfit = candles.at(-2).close + atr.at(-2) * 2;
        }

        const triggerStopLoss = price < stopLoss;
        const triggerShort = price > takeProfit;
        const criterionSell = triggerStopLoss || triggerShort;

        console.log(
          criterionSell,
          `price - ${price},
          stopLoss - ${stopLoss}, takeProfit - ${takeProfit}`
        );
        if (criterionSell) {
          await composeCreateSellOrder();
          clearInterval(checkSellCriterionInterval);
          resolve();
        }
      }, 0.25 * 60 * 1000);
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
