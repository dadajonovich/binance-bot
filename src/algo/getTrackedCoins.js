const getTrackedCoins =
  (client, getLotParams = (f) => f) =>
  async (coins = []) => {
    const trackedCoins = await Promise.all(
      coins.map(async (coin) => {
        const { stepSize, tickSize } = await getLotParams(client, coin.pair);

        return {
          pair: coin.pair,
          currentPrice: coin.currentPrice,
          volatility: coin.volatility,
          targetPrice:
            coin.currentPrice - (coin.currentPrice * coin.volatility) / 100,
          stepSize,
          tickSize,
        };
      })
    );
    console.log(trackedCoins);
    return trackedCoins;
  };

module.exports = getTrackedCoins;
