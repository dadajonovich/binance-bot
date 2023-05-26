const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 &&
  coin.percentDiffEMA > 0 &&
  coin.OBV.at(-1) > coin.OBV.at(-2);

const crossEnvelope = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.envelope.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
    coin.envelope.at(-3);

  const criterionUnderEMA200 =
    coin.EMA200.at(-2) < secondCandle.low &&
    coin.EMA200.at(-3) < thirdCandle.low;

  const crossLowLine =
    thirdCandle.open < thirdLowerLine && secondCandle.close > secondLowerLine;
  if (crossLowLine) {
    return true;
  }
  return false;
};

const emaCross = (coin) => {
  // const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  // const thirdCandle = coin.candles.at(-3);

  const criterionCrossEMA9 =
    coin.EMA9.at(-3) < coin.EMA20.at(-3) &&
    coin.EMA9.at(-2) > coin.EMA20.at(-2);

  const criterionUnderEMA9 = secondCandle.close > coin.EMA9.at(-2);
  const criterionUnderEMA200 = coin.percentDiffEMA200 > 2;

  if (criterionCrossEMA9 && criterionUnderEMA9 && criterionUnderEMA200) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 0.3 && crossEnvelope(coin)
  );
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
