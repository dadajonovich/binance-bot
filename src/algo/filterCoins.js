const firstCriterion = (coin) =>
  coin.volatility > 0.5 &&
  coin.MACD.at(-1) > 0 &&
  coin.MACD.at(-2) < 0 &&
  coin.MACD.at(-2) > coin.signalMACD.at(-2) &&
  coin.MACD.at(-3) < coin.signalMACD.at(-3) &&
  coin.RSI.at(-1) > 50;

const secondCriterion = (coin) =>
  coin.volatility > 0.25 &&
  coin.MACD.at(-1) > coin.signalMACD.at(-1) &&
  coin.currentPrice < coin.goalFIB;

const filterCoins = (coins, percentageDiffernce) => {
  // const filteredCoins = coins.filter((coin) => secondCriterion(coin));
  const sortCoins = coins.sort((a, b) => b.percentDiffEMA - a.percentDiffEMA);
  // return filteredCoins;
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
