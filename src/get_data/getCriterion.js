const getCriterion = (SMA, MACD, RSI, Bollinger, { currentPrice }) => {
  const criterionSMA = ((SMA.at(-1) - currentPrice) / currentPrice) * 100 < -5;

  const criterionRSI = RSI.at(-1) > 50 && RSI.at(-1) < 50;

  const [lastUpper, lastMiddle, lastLower] = Bollinger[Bollinger.length - 1];

  const tunnelPrice = ((lastUpper - lastLower) / lastLower) * 100;

  const criterionBollinger =
    currentPrice < lastUpper && currentPrice > lastMiddle && tunnelPrice < 5;

  const criterionMACD = MACD.at(-1) > 0 && MACD.at(-2) < 0;

  const criterion = criterionBollinger;

  return criterion;
};

module.exports = getCriterion;
