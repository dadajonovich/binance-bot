const { CronJob } = require('cron');

const createSellOrder =
  (
    client,
    curryGetCoins = (f) => f,
    orderExist = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f,
    curryComposeCreateOrder = (f) => f,
    getBalance = (f) => f
  ) =>
  async (pair, asset, stepSize, tickSize, quantityAsset) => {
    try {
      console.log('Sell order!');

      let isSellOrder = false;
      let count = 0;

      const sellSignalKaufman = ({ kama, filterKama }) => {
        let criterionSell = false;
        if (kama.at(-2) < kama.at(-3)) {
          criterionSell = kama.at(-3) - kama.at(-2) > filterKama;
        }

        return criterionSell;
      };

      await new Promise((resolve) => {
        const checkSellCriterionInterval = new CronJob(
          '1 */1 * * *',
          async () => {
            console.log('tick checkSellCriterionInterval...');
            const [coin] = await curryGetCoins([pair]);

            const criterionSell = sellSignalKaufman(coin);

            console.log(criterionSell);
            if (criterionSell) {
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
          false,
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
