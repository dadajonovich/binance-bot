const { CronJob } = require('cron');

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
  async (pair, asset, stepSize, tickSize, quantityAsset) => {
    try {
      console.log('Sell order!');

      let isSellOrder = false;
      let count = 0;

      // const kama = [15, 50, 100, 110, 115, 120, 90, 150, 130, 80];
      // const filterKama = 15;
      // const sellSignalKaufman = ({ kama, filterKama }) => {
      //   const criterionSell =
      //     kama.at(-5) - kama.at(-2) > filterKama ||
      //     kama.at(-4) - kama.at(-2) > filterKama ||
      //     kama.at(-3) - kama.at(-2) > filterKama;

      //   return criterionSell;
      // };

      const sellSignalKaufman = (ama, filter) => {
        let criterionSell = false;

        const sliceArr = ama.slice(-5, -1);

        for (let i = 0; i < sliceArr.length - 1; i++) {
          const betweenPeriods = sliceArr.at(i) - sliceArr.at(-1);
          if (betweenPeriods > filter) {
            criterionSell = true;
          }
        }

        return criterionSell;
      };
      // console.log(sellSignalKaufman(kama, filterKama));

      await new Promise((resolve) => {
        const checkSellCriterionInterval = new CronJob(
          '1 0 * * *',
          async () => {
            console.log('tick checkSellCriterionInterval...');
            const [coin] = await curryGetCoins([pair]);

            const criterionSell = sellSignalKaufman(coin.kama, coin.filterKama);

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

module.exports = createSellOrder;
