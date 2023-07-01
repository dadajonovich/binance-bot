const searchSignal =
  (
    curryGetCoins = (f) => f,
    filterCoins = (f) => f,
    currySendMessage = (f) => f,
    getStrCoinsInfo = (f) => f,
    curryTradeAlgo = (f) => f
  ) =>
  async (topPairs = []) => {
    try {
      let filteredCoins = [];
      console.log('start searchSignal');
      await new Promise((resolve) => {
        const searchCoins = async () => {
          console.log('tick searchCoins');
          const coins = await curryGetCoins(topPairs);
          filteredCoins = filterCoins(coins);
          if (filteredCoins.length > 0) {
            resolve();
          } else {
            setTimeout(searchCoins, 1 * 60 * 1000);
          }
        };
        searchCoins();
      });

      await currySendMessage(getStrCoinsInfo(filteredCoins));
      const resultMonitor = await curryTradeAlgo(filteredCoins);
      console.log(`resultMonitor - ${resultMonitor}`);
      if (resultMonitor.every((elem) => elem === true)) {
        console.log('restart tradeAlgo');
        searchSignal(
          curryGetCoins,
          filterCoins,
          currySendMessage,
          getStrCoinsInfo,
          curryTradeAlgo
        )(topPairs);
      }
    } catch (err) {
      console.error('Error in trading algorithm', err);
    }
  };

module.exports = searchSignal;
