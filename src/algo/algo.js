const getTrackedCoins = (coins = []) => {
  const trackedCoins = coins.map((coin) => ({
    pair: coin.pair,
    currentPrice: coin.currentPrice,
    volatility: coin.volatility,
    targetPrice:
      coin.currentPrice - (coin.currentPrice * coin.volatility) / 100,
  }));
  console.log(trackedCoins);
  return trackedCoins;
};

const monitorPrice =
  (
    client,
    getCandles = (f) => f,
    getPrice = (f) => f,
    { intervalToMonitor = '5m', period = 1 } = {},
    createOrder = (f) => f,
    getBalance = (f) => f
  ) =>
  (trackedCoins = []) => {
    trackedCoins.forEach(async (coin) => {
      const { pair, targetPrice } = coin;
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const price = getPrice(candles);
      // if (price.currentPrice.toFixed(4) < targetPrice.toFixed(4)) {
      if (true) {
        const { balanceFree } = await getBalance(client);
        console.log(balanceFree);
        // const order = await createOrder(
        //   client,
        //   pair,
        //   'BUY',
        //   'LIMIT',
        //   balanceFree.toFixed(4),
        //   targetPrice.toFixed(4)
        // );
        // console.log(order);
      } else console.log('U mirin brah?');
    });
  };

module.exports = { getTrackedCoins, monitorPrice };
