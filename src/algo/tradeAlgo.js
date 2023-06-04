const tradeAlgo = async (
  curryGetCoins = (f) => f,
  topPairs = [],
  parameters = {},
  filterCoins = (f) => f,
  currySendMessage = (f) => f,
  getStrCoinsInfo = (f) => f,
  curryMonitorPrice = (f) => f
) => {
  try {
    let filteredCoins = [];
    console.log('start tradeAlgo');
    await new Promise((resole) => {
      const searchCoins = setInterval(async () => {
        console.log('tick searchCoins');
        const coins = await curryGetCoins(topPairs, parameters);
        filteredCoins = filterCoins(coins);
        if (filteredCoins.length > 0) {
          clearInterval(searchCoins);
          resole();
        }
      }, 5 * 60 * 1000);
    });
    await currySendMessage(getStrCoinsInfo(filteredCoins));
    const resultMonitor = await curryMonitorPrice(filteredCoins);
    console.log(`resultMonitor - ${resultMonitor}`);
    if (resultMonitor.every((elem) => elem === true)) {
      console.log('restart tradeAlgo');
      tradeAlgo(
        curryGetCoins,
        topPairs,
        parameters,
        filterCoins,
        currySendMessage,
        getStrCoinsInfo,
        curryMonitorPrice
      );
    }
  } catch (err) {
    console.error('Error in trading algorithm', err);
  }
};

module.exports = tradeAlgo;
