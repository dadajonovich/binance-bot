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

const thirdCriterion = (coin) =>
  coin.percentDiffHULL > 0 &&
  coin.percentDiffKAMA > 0 &&
  coin.percentDiffEMA > 0;

const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter((coin) => thirdCriterion(coin));
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffKAMA - a.percentDiffKAMA
  );
  // return filteredCoins;
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
