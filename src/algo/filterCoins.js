const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter(
    (coin) =>
      coin.MACD.at(-1) > 0 &&
      coin.MACD.at(-2) < 0 &&
      coin.volatility > 1 &&
      // coin.MACD.at(-1) > coin.MACD.at(-2) &&
      // coin.RSI.at(-1) > 60 &&
      // percentageDiffernce(coin.currentPrice, coin.VWMA.at(-1)) > 0.0 &&
      // // percentageDiffernce(coin.currentPrice, coin.SMA.at(-1)) > 0.01
      coin.OBV.at(-1) > coin.OBV.at(-2)
  );
  return filteredCoins;
};

module.exports = filterCoins;
