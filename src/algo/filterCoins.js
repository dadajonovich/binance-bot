const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter(
    (coin) =>
      coin.MACD.at(-1) > coin.MACD.at(-2) &&
      coin.RSI.at(-1) > coin.RSI.at(-2) &&
      percentageDiffernce(coin.currentPrice, coin.VWMA.at(-1)) > 0.03 &&
      coin.OBV.at(-1) > coin.OBV.at(-2)
  );
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
