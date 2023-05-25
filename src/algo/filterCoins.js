const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 &&
  coin.percentDiffEMA > 0 &&
  coin.OBV.at(-1) > coin.OBV.at(-2);

const emaCross = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const criterionCrossEMA8 =
    coin.EMA8.at(-3) < coin.EMA21.at(-3) &&
    coin.EMA8.at(-2) > coin.EMA21.at(-2);

  const criterionUnderEMA8 =
    coin.EMA8.at(-2) < secondCandle.low && coin.EMA8.at(-3) < thirdCandle.low;

  const criterionUnderEMA21 =
    coin.EMA21.at(-2) < secondCandle.low && coin.EMA21.at(-3) < thirdCandle.low;

  const criterionUnderEMA200 =
    coin.EMA200.at(-2) < secondCandle.low &&
    coin.EMA200.at(-3) < thirdCandle.low;
  if (
    criterionCrossEMA8 &&
    criterionUnderEMA8 &&
    criterionUnderEMA21 &&
    criterionUnderEMA200
  ) {
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
