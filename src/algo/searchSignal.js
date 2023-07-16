const searchSignal =
  (
    curryGetCoins = (f) => f,
    filterCoins = (f) => f,
    currySendMessage = (f) => f,
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
      const [coin] = filteredCoins;
      await currySendMessage(`🟣Buy ${coin}!`);
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

module.exports = searchSignal;
