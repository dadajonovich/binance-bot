const firstCriterion = (coin) =>
  coin.volatility > 0.1 &&
  coin.MACD.at(-1) > 0 &&
  coin.MACD.at(-2) < 0 &&
  coin.MACD.at(-1) > coin.signalMACD.at(-1) &&
  coin.MACD.at(-2) < coin.signalMACD.at(-2) &&
  coin.RSI.at(-1) > 50;

const secondCriterion = (coin) =>
  coin.volatility > 0.1 &&
  coin.williams.at(-1) < -50 &&
  coin.williams.at(-2) > -50 &&
  coin.MACD.at(-1) > coin.signalMACD.at(-1) &&
  coin.RSI.at(-1) > 50;

const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter((coin) => firstCriterion(coin));
  // const sortCoins = filteredCoins.sort((a, b) => b.EMA.at(-1) - a.EMA.at(-1));
  return filteredCoins;
};

module.exports = filterCoins;
