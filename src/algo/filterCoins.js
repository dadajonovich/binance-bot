const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const crossMACD = (coin) => {
  const bullishCandle = coin.candles.at(-2);
  const criterionBullishCandle = bullishCandle.close > bullishCandle.open;
  const shadowCriterionBullishCandle =
    bullishCandle.close === bullishCandle.high;

  const prevMACD = coin.MACD.at(-4) < coin.signalMACD.at(-4);
  const currentMACD =
    coin.MACD.at(-3) > coin.signalMACD.at(-2) && coin.MACD.at(-3) < 0;
  const RSI = coin.RSI.at(-2) > 50;

  if (
    prevMACD &&
    currentMACD &&
    criterionBullishCandle &&
    shadowCriterionBullishCandle
  ) {
    return true;
  }
  return false;
};

const detectThreeSoldiersPattern = (coin) => {
  const bearishCandle = coin.candles.at(-4);
  const firstCandle = coin.candles.at(-3);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-1);

  const criterionBearishCandle = bearishCandle.close < bearishCandle.open;
  const criterionGrowthFirstCandle = firstCandle.close > firstCandle.open;
  const criterionGrowthSecondCandle = secondCandle.close > secondCandle.open;
  const criterionGrowthThirdCandle = thirdCandle.close > thirdCandle.open;

  const maxShadowSize = 0.15;
  const maxSize = 0.15;

  const bodyThirdCandle = thirdCandle.close - thirdCandle.open;
  const bodySecondCandle = secondCandle.close - secondCandle.open;
  const bodyFirstCandle = firstCandle.close - firstCandle.open;

  const shadowThirdCandle = thirdCandle.high - thirdCandle.low;
  const shadowSecondCandle = secondCandle.high - secondCandle.low;
  const shadowFirstCandle = firstCandle.high - firstCandle.low;

  const sizeCriterionThirdCandle =
    percentageDiffernce(bodyThirdCandle, bodySecondCandle) < maxSize;

  const sizeCriterionSecondCandle =
    percentageDiffernce(bodySecondCandle, bodyFirstCandle) < maxSize;

  const shadowCriterionThirdCandle =
    percentageDiffernce(shadowThirdCandle, bodyThirdCandle) < maxShadowSize;

  const shadowCriterionSecondCandle =
    percentageDiffernce(shadowSecondCandle, bodySecondCandle) < maxShadowSize;

  const shadowCriterionFirstCandle =
    percentageDiffernce(shadowFirstCandle, bodyFirstCandle) < maxShadowSize;

  if (
    // criterionBearishCandle &&
    criterionGrowthFirstCandle &&
    criterionGrowthSecondCandle &&
    criterionGrowthThirdCandle &&
    firstCandle.close < secondCandle.close &&
    secondCandle.close < thirdCandle.close &&
    // bodyThirdCandle >= bodySecondCandle &&
    // bodySecondCandle >= bodyFirstCandle &&
    shadowCriterionFirstCandle &&
    shadowCriterionSecondCandle &&
    shadowCriterionThirdCandle
  ) {
    return true;
  }

  return false;
};

const firstCriterion = (coin) =>
  coin.percentDiffSMA > 0 &&
  coin.percentDiffEMA > 0 &&
  coin.OBV.at(-1) > coin.OBV.at(-2);

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => detectThreeSoldiersPattern(coin) && coin.volatility > 0.1
  );
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
