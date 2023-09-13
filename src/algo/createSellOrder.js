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
        let exthigh = null;
        for (let i = 2; i < ama.length - 1; i++) {
          if (ama.at(i) < ama.at(i - 1) && ama.at(i - 1) > ama.at(i - 2)) {
            exthigh = ama.at(i - 1);
          }
        }
        if (
          ama.at(-2) < ama.at(-3) &&
          exthigh - ama.at(-2) > filter.at(-2) * 1
        ) {
          return true;
        }
        return false;
      };

      const volatilityFilter = (atr, filter) => {
        const betweenPeriods = atr.at(-2) - atr.at(-3);

        if (betweenPeriods > filter.at(-2) * 1) {
          return true;
        }

        return false;
      };

      await new Promise((resolve) => {
        const checkSellCriterionInterval = new CronJob(
          '0 5 0 * * *',
          async () => {
            console.log('tick checkSellCriterionInterval...');
            const [coin] = await curryGetCoins([pair]);

            const criterionSell =
              sellSignalKaufman(coin.kama, coin.filterKAMA) ||
              volatilityFilter(coin.atr, coin.filterATR);

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
          null,
          null,
          null,
          0
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
