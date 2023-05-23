const ta = require('ta.js');

const percentageDiffernce = (newval, oldval) => ta.dif(newval, oldval);

// const firstCriterion = (coin) => {
//   let crossingIndex = null;
//   for (let i = -1; i >= -4; i--) {
//     if (
//       crossingIndex === null &&
//       coin.signalMACD.at(i - 1) > coin.MACD.at(i - 1) &&
//       coin.signalMACD.at(i) < coin.MACD.at(i) &&
//       coin.MACD.at(i) < 0
//     ) {
//       crossingIndex = i;
//       console.log(`pair - ${coin.pair}, crossingIndex - ${crossingIndex}`);
//     }
//   }

//   if (crossingIndex !== null) {
//     if (coin.RSI.at(-1) > 50 && coin.MACD.at(-1) > 0) {
//       return true;
//     }
//   }
//   return false;
// };

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

const emaCross = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);

  const criterionCross =
    coin.ema9.at(-2) < coin.ema21.at(-2) &&
    coin.ema9.at(-1) > coin.ema21.at(-1);

  const criterionUnderEMA9 =
    coin.ema9.at(-1) < firstCandle.low && coin.ema9.at(-2) < secondCandle.low;

  const criterionUnderEMA21 =
    coin.ema21.at(-1) < firstCandle.low && coin.ema21.at(-2) < secondCandle.low;

  if (criterionCross && criterionUnderEMA9 && criterionUnderEMA21) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) => emaCross(coin));
  console.log(filteredCoins);
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
