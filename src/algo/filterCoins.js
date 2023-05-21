const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 &&
  coin.percentDiffEMA > 0 &&
  coin.OBV.at(-1) > coin.OBV.at(-2);

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) => firstCriterion(coin));
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
