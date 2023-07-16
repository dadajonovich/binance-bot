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

      await new Promise((resolve) => {
        const checkSellCriterionInterval = async () => {
          console.log('tick checkSellCriterionInterval...');
          const [{ candles, atr }] = await curryGetCoins([pair]);

          if (stopLoss === null) {
            stopLoss = Number(candles.at(-1).close) - atr.at(-2);
          }

          if (takeProfit === null) {
            takeProfit = Number(candles.at(-1).close) + atr.at(-2) * 2;
          }

          const triggerStopLoss = candles.at(-2).close < stopLoss;
          const triggerShort = candles.at(-1).close > takeProfit;
          const criterionSell = triggerStopLoss || triggerShort;

          console.log(
            criterionSell,
            `stopLoss - ${stopLoss}, takeProfit - ${takeProfit}, atr - ${atr.at(
              -2
            )}`
          );
          if (criterionSell) {
            await composeCreateSellOrder();
            resolve();
          } else {
            setTimeout(checkSellCriterionInterval, 0.25 * 60 * 1000);
          }
        };
        checkSellCriterionInterval();
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
