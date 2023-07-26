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

      // const AMA = [15, 50, 100, 110, 115, 120, 160, 150, 130, 120];
      // const filterValue = 15;
      const shortSignalKaufman = (ama, filter) => {
        let criterionShort = false;

        const sliceArr = ama.slice(-4);
        const maxKAMA = Math.max(...sliceArr);
        const minKAMA = Math.min(...sliceArr);
        const indexMax = sliceArr.indexOf(maxKAMA);
        const indexMin = sliceArr.indexOf(minKAMA);

        if (indexMax < indexMin) {
          criterionShort = maxKAMA - ama.at(-2) > filter;
        }
        return criterionShort;
      };

      // console.log(shortSignalKaufman(AMA, filterValue));

      await new Promise((resolve) => {
        const checkSellCriterionInterval = async () => {
          console.log('tick checkSellCriterionInterval...');
          const [{ filterKama, kama }] = await curryGetCoins([pair]);

          const criterionSell = shortSignalKaufman(kama, filterKama);

          console.log(criterionSell);
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
