const getCriterion = (MACD, RSI) => {
  const criterionMACD = MACD.at(-1) > 0 && MACD.at(-2) < 0;
  const criterionRSI = RSI.at(-1) > 55 && RSI.at(-2) < 45;

  const criterion = criterionMACD || criterionRSI;

  return criterion;
};

module.exports = getCriterion;
