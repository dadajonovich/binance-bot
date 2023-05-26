const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 &&
  coin.percentDiffEMA > 0 &&
  coin.OBV.at(-1) > coin.OBV.at(-2);

const emaCross = (coin) => {
  // const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  // const thirdCandle = coin.candles.at(-3);

  const criterionCrossEMA9 =
    coin.EMA9.at(-3) < coin.EMA20.at(-3) &&
    coin.EMA9.at(-2) > coin.EMA20.at(-2);

  const criterionUnderEMA9 = secondCandle.low > coin.EMA9.at(-2);
  const criterionUnderEMA20 = coin.EMA20.at(-2) > coin.EMA50.at(-2);
  const criterionUnderEMA50 = coin.EMA50.at(-2) > coin.EMA200.at(-2);

  if (criterionCrossEMA9 && criterionUnderEMA9 && criterionUnderEMA50) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 0.3 && emaCross(coin)
  );
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
