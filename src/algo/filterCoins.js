const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 && coin.percentDiffEMA > 0;

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) => firstCriterion(coin));
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffSMA - a.percentDiffSMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
