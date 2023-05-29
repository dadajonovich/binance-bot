const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 &&
  coin.percentDiffEMA > 0 &&
  coin.OBV.at(-1) > coin.OBV.at(-2);

const crossEnvelope = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [firstUpperLine, firstMiddleLine, firstLowerLine] =
    coin.envelope.at(-1);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.envelope.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
    coin.envelope.at(-3);

  const criterionUnderEMA200 =
    coin.EMA200.at(-2) < secondCandle.close &&
    coin.EMA200.at(-3) < thirdCandle.close;

  const criterionUnderEMA50 =
    coin.EMA50.at(-2) < secondCandle.close &&
    coin.EMA50.at(-3) < thirdCandle.close;

  const crossLowLine =
    // thirdCandle.open < thirdLowerLine && secondCandle.open > secondLowerLine;
    secondCandle.open < secondLowerLine && firstCandle.open > firstLowerLine;
  if (crossLowLine) {
    return true;
  }
  return false;
};

const crossKeltner = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [firstUpperLine, firstMiddleLine, firstLowerLine] = coin.keltner.at(-1);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const crossLowLine =
    // thirdCandle.open < thirdLowerLine && secondCandle.open > secondLowerLine;
    secondCandle.open < secondLowerLine && firstCandle.open > firstLowerLine;
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

  const criterionUnderEMA9 = coin.EMA9.at(-2) < secondCandle.low;

  if (criterionCrossEMA9 && criterionUnderEMA9) {
    return true;
  }
  return false;
};

const crossOBV = (coin) => {
  const crossEmaOBV =
    coin.obvEMA9.at(-3) < coin.obvEMA20.at(-3) &&
    coin.obvEMA9.at(-2) > coin.obvEMA20.at(-2);

  const underLinesOBV =
    coin.obvEMA9.at(-2) >
    coin.obvEMA20.at(-2) >
    coin.obvEMA50.at(-2) >
    coin.obvEMA200.at(-2);

  if (crossEmaOBV && underLinesOBV) {
    return true;
  }
  return false;
};

const crossKAMA = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const crossKama =
    coin.kama.at(-3) > thirdCandle.close &&
    coin.kama.at(-2) < secondCandle.close;
  const diff = coin.kama.at(-2) - coin.kama.at(-3);
  const kamaFilter = diff > coin.filterKama;

  if (crossKama && kamaFilter) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 1.5 && crossKeltner(coin)
  );
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
