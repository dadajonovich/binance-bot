const createSellOrder =
  (
    client,
    curryGetCoins = (f) => f,
    getValuesForOrder = (f) => f,
    createOrder = (f) => f,
    orderExist = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f
  ) =>
  async (pair, stepSize, tickSize, quantityAsset) => {
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

      const shortTime = (macd, lineSignal) => {
        const secondBarChart = macd.at(-2) - lineSignal.at(-2);
        const thirdBarChart = macd.at(-3) - lineSignal.at(-3);
        const fourthBarChart = macd.at(-4) - lineSignal.at(-4);

        if (macd.at(-2) < 0 && lineSignal.at(-2) > macd.at(-2)) {
          return true;
        }
        if (
          macd.at(-2) > 0 &&
          secondBarChart < thirdBarChart &&
          fourthBarChart < thirdBarChart
        ) {
          return true;
        }
        return false;
      };

      await new Promise((resolve) => {
        const checkSellCriterionInterval = async () => {
          console.log('tick checkSellCriterionInterval...');
          const [{ candles, atr, keltner, macd, lineSignal }] =
            await curryGetCoins([pair]);

          const [secondUpperLine, secondMiddleLine, secondLowerLine] =
            keltner.at(-2);

          // if (stopLoss === null) {
          //   stopLoss = secondLowerLine;
          // }

          // if (takeProfit === null) {
          //   takeProfit = Number(candles.at(-1).close) + atr.at(-2) * 3;
          // }

          // const triggerStopLoss = candles.at(-2).close < stopLoss;
          // const triggerShort = candles.at(-1).close > takeProfit;
          const criterionSell = shortTime(macd, lineSignal);

          console.log(
            criterionSell
            // `stopLoss - ${stopLoss}, takeProfit - ${takeProfit}, atr - ${atr.at(
            //   -2
            // )}`
          );
          if (criterionSell) {
            await composeCreateSellOrder();
            resolve();
          } else {
            setTimeout(checkSellCriterionInterval, 0.1 * 60 * 1000);
          }
        };
        checkSellCriterionInterval();
      });

      await new Promise((resolve) => {
        const checkSellInterval = async () => {
          console.log('tick checkSellInterval...');
          const { sellOrderExists: sellMark } = await orderExist(
            client,
            pair,
            getOpenOrders
          );
          count += 1;
          if (!sellMark) {
            isSellOrder = true;
            resolve();
          } else if (count > 5) {
            const orders = await getOpenOrders(client);
            await cancelOrders(client, orders);
            await composeCreateSellOrder();
            count = 0;
            setTimeout(checkSellInterval, 0.25 * 60 * 1000);
          } else {
            setTimeout(checkSellInterval, 0.25 * 60 * 1000);
          }
        };
        checkSellInterval();
      });

      return isSellOrder;
    } catch (err) {
      console.error(`Error in createSellOrder`, err);
      return false;
    }
  };

module.exports = createSellOrder;
