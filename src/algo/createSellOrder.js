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

      const sellSignalKaufman = (ama, filter) => {
        let criterionSell = false;
        const betweenPeriods = ama.at(-3) - ama.at(-2);

        if (betweenPeriods > filter) {
          criterionSell = true;
        }

        return criterionSell;
      };

      await new Promise((resolve) => {
        const checkSellCriterionInterval = new CronJob(
          // '1 0 * * *',
          '1 */4 * * *',
          async () => {
            console.log('tick checkSellCriterionInterval...');
            const [coin] = await curryGetCoins([pair]);

            const criterionSell = sellSignalKaufman(coin.kama, coin.filterKama);

            console.log(criterionSell);
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
