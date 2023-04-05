const { createTracing } = require('trace_events');

const getCriterion = (RSI) => {
  const criterion = RSI.at(-1) > 0 && RSI.at(-2) < 0;

  return criterion;
};
