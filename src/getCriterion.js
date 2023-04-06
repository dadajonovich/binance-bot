const getCriterion = (MACD, RSI) => {
  const criterionMACD = MACD.at(-1) > 0 && MACD.at(-2) < 0;
  const criterionRSI = RSI.at(-1) > 50 && RSI.at(-2) < 50;

  const criterion = criterionMACD;

  return criterion;
};

module.exports = getCriterion;
