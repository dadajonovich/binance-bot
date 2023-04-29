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

module.exports = getTrackedCoins;
