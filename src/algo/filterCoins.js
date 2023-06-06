const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const crossKeltner = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const criterionGrowthSecondCandle = secondCandle.close > secondCandle.open;
  const bodySecondCandle = secondCandle.close - secondCandle.open;
  const shadowSecondCandle = secondCandle.high - secondCandle.low;
  const maxShadowSize = 0.4;
  const shadowCriterionSecondCandle =
    percentageDiffernce(shadowSecondCandle, bodySecondCandle) < maxShadowSize;

  const [firstUpperLine, firstMiddleLine, firstLowerLine] = coin.keltner.at(-1);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);
  const sma50Criterion =
    coin.sma50.at(-3) < thirdMiddleLine && coin.sma50.at(-2) < secondMiddleLine;
  const crossLowLine = secondCandle.open > secondUpperLine;

  if (
    crossLowLine &&
    shadowCriterionSecondCandle &&
    criterionGrowthSecondCandle
  ) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 2 && crossKeltner(coin)
  );

  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
