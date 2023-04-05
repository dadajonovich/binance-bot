const getCriterion = (MACD) => {
  const criterion = MACD.at(-1) > 0 && MACD.at(-2) < 0;
  return criterion;
};

module.exports = getCriterion;
