import { CronJob } from 'cron';

const createSellOrder =
  (
    client,
    curryGetCoins = (f) => f,
    orderExist = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f,
    curryComposeCreateOrder = (f) => f,
    getBalance = (f) => f,
    currySendMessage = (f) => f
  ) =>
  async (pair, asset, stepSize, tickSize) => {
    try {
      console.log('Sell order!');

      let isSellOrder = false;
      let count = 0;
      let stopLoss;
      let takeProfit;

      await new Promise((resolve) => {
        const checkSellCriterionInterval = new CronJob(
          '* */1 * * * *',
          async () => {
            console.log('tick checkSellCriterionInterval...');
            const [coin] = await curryGetCoins([pair]);
            const { [pair]: price } = await client.prices({ symbol: pair });

            if (stopLoss === null) {
              stopLoss =
                Number(coin.candles.at(-2).close) - coin.atr.at(-2) * 1;
            }

            if (takeProfit === null) {
              takeProfit =
                Number(coin.candles.at(-2).close) + coin.atr.at(-2) * 3;
            }

            const triggerStopLoss = coin.candles.at(-2).close < stopLoss;
            const triggerShort = price > takeProfit;

            const criterionSell = triggerShort || triggerStopLoss;

            console.log(`criterionSell - ${createSellOrder},
            price - ${price},
            takeProfit - ${takeProfit},
            stopLoss - ${stopLoss}`);
            if (criterionSell) {
              const { balanceFree: quantityAsset } = await getBalance(
                client,
                asset
              );
              await curryComposeCreateOrder(
                pair,
                quantityAsset,
                stepSize,
                tickSize,
                'SELL'
              );
              checkSellCriterionInterval.stop();
              resolve();
            }
          },
          null,
          null,
          'UTC'
        );
        checkSellCriterionInterval.start();
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
            await currySendMessage(`Sell ${pair}!`);
            resolve();
          } else if (count > 5) {
            const orders = await getOpenOrders(client);
            await cancelOrders(client, orders);
            const { balanceFree: newQuantityAsset } = await getBalance(
              client,
              asset
            );
            await curryComposeCreateOrder(
              pair,
              newQuantityAsset,
              stepSize,
              tickSize,
              'SELL'
            );
            count = 0;
            setTimeout(checkSellInterval, 0.5 * 60 * 1000);
          } else {
            setTimeout(checkSellInterval, 0.5 * 60 * 1000);
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

export default createSellOrder;
