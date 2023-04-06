const getCriterion = (SMA, MACD, { currentPrice }) => {
  const criterionSMA = ((SMA.at(-1) - currentPrice) / currentPrice) * 100 < -10;
  const criterionMACD = MACD.at(-1) > 0 && MACD.at(-2) < 0;

  const criterion = criterionSMA || criterionMACD;

  return criterion;
};

module.exports = getCriterion;
