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
    let stopLoss;
    let takeProfit;

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
        const [
          {
            candles,
            keltner,
            sma200,
            envelope,
            parabolic,
            macd,
            signalMacd,
            atr,
          },
        ] = await curryGetCoins([pair]);

        // if (stopLoss === null) {
        //   stopLoss = candles.at(-2).close - atr.at(-2) * 2;
        // }

        // if (takeProfit === null) {
        //   takeProfit = candles.at(-2).close + atr.at(-2) * 3;
        // }
        const [secondUpperLine, secondMiddleLine, secondLowerLine] =
          keltner.at(-2);

        // const [secondUpperLine, secondMiddleLine, secondLowerLine] =
        //   envelope.at(-2);

        // const crossMacd =
        //   macd.at(-2) < signalMacd.at(-2) && macd.at(-3) > signalMacd.at(-3);
        const crossSma = sma200.at(-2) > secondLowerLine;
        // const crossMiddleLine = candles.at(-2).close > secondUpperLine;
        const crossUpperLine = candles.at(-2).close > secondUpperLine;
        const crossLowLine = candles.at(-2).close < secondLowerLine;
        // const triggerStopLoss = price < stopLoss;
        // const triggerShort = price > takeProfit;
        const criterionSell = crossUpperLine || crossLowLine;

        console.log(criterionSell, stopLoss, takeProfit);
        if (criterionSell) {
          await composeCreateSellOrder();
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
