const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

const crossUnderFibo = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const criterionCross =
    secondCandle.close > coin.lineBottom && thirdCandle.close < coin.lineBottom;

  if (criterionCross) {
    return true;
  }
  return false;
};

// const breakoutUpperLine = (coin) => {
//   const secondCandle = coin.candles.at(-2);
//   const thirdCandle = coin.candles.at(-3);
// const rangeSecondCandle = coin.rangeCandlePercent.at(-2);
// const rangeThirdCandle = coin.rangeCandlePercent.at(-3);
// const currentAverageRangeCandle = coin.averageRangeCandle.at(-1);

// const criterionGrowthSecondCandle = secondCandle.close > secondCandle.open;
// const criterionGrowthThirdCandle = thirdCandle.close > thirdCandle.open;

// const bodySecondCandle = secondCandle.close - secondCandle.open;
// const bodyThirdCandle = thirdCandle.close - thirdCandle.open;

// const shadowSecondCandle = secondCandle.high - secondCandle.low;
// const shadowThirdCandle = thirdCandle.high - thirdCandle.low;

// const maxShadowSize = 0.3;
// const maxSize = 0.99;
// const maxRange = 0.99;

// const rangeCriterionSecondCandle =
//   Math.abs(
//     percentageDiffernce(rangeSecondCandle, currentAverageRangeCandle)
//   ) < maxRange;
// const rangeCriterionThirdCandle =
//   Math.abs(percentageDiffernce(rangeThirdCandle, currentAverageRangeCandle)) <
//   maxRange;

// const shadowCriterionSecondCandle =
//   percentageDiffernce(shadowSecondCandle, bodySecondCandle) < maxShadowSize;
// const shadowCriterionThirdCandle =
//   percentageDiffernce(shadowThirdCandle, bodyThirdCandle) < maxShadowSize;

// const sizeCriterionSecondCandle =
//   Math.abs(percentageDiffernce(bodySecondCandle, bodyThirdCandle)) < maxSize;

//   const [secondUpperLine, secondMiddleLine, secondLowerLine] =
//     coin.keltner.at(-2);
//   const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);
//   const crossLowLine =
//     secondCandle.close > secondUpperLine && thirdCandle.close < thirdUpperLine;

//   if (
//     criterionGrowthSecondCandle &&
//     criterionGrowthThirdCandle &&
//     // shadowCriterionSecondCandle &&
//     // shadowCriterionThirdCandle &&
//     // sizeCriterionSecondCandle &&
//     // rangeCriterionSecondCandle &&
//     // rangeCriterionThirdCandle &&
//     crossLowLine
//   ) {
//     return true;
//   }
//   return false;
// };

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 1 && crossUnderFibo(coin)
  );

  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
