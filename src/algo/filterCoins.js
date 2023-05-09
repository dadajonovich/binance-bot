const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter(
    (coin) =>
      coin.MACD.at(-1) > 0 &&
      coin.MACD.at(-2) < 0 &&
      // coin.SMA.at(-1) < coin.currentPrice &&
      coin.volatility > 0.5 &&
      coin.williams < -50
    // coin.williams.at(-1) > -80 &&
    // coin.williams.at(-2) < -80
    // coin.MACD.at(-1) > coin.MACD.at(-2) &&
    // coin.currentPrice > coin.EMA.at(-1) &&
    // coin.RSI.at(-1) < 60 &&
    // coin.RSI.at(-1) > 50
    // percentageDiffernce(coin.currentPrice, coin.VWMA.at(-1)) > 0.015 &&
    // percentageDiffernce(coin.currentPrice, coin.EMA.at(-1)) > 0.02 &&
    // coin.OBV.at(-1) > coin.OBV.at(-2)
  );
  // const sortCoins = filteredCoins.sort((a, b) => b.EMA.at(-1) - a.EMA.at(-1));
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
