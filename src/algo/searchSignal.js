import { CronJob } from 'cron';

const searchSignal =
  (
    curryGetCoins = (f) => f,
    filterCoins = (f) => f,
    curryTradeAlgo = (f) => f
  ) =>
  async (topPairs = []) => {
    try {
      let filteredCoins = [];
      console.log('start searchSignal');
      await new Promise((resolve) => {
        const searchCoins = new CronJob(
          '15 0 * * *',
          // '1 */1 * * *',
          async () => {
            console.log('tick searchCoins');
            const coins = await curryGetCoins(topPairs);
            filteredCoins = filterCoins(coins);
            if (filteredCoins.length > 0) {
              searchCoins.stop();
              resolve();
            }
          },
          null,
          false,
          'UTC',
          null
          // true
        );
        searchCoins.start();
      });

      const resultSearchSignal = await curryTradeAlgo(filteredCoins);
      console.log(`resultSearchSignal - ${resultSearchSignal}`);
      if (resultSearchSignal.every((elem) => elem === true)) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error in searchSignal', err);
      return false;
    }
  };

export default searchSignal;
