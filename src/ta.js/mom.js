const ta = require('ta.js');

const getMOM = (values, period = 10, percentage = false) => {
  const mom = ta.mom(values, period, percentage);

  return mom;
};

module.exports = getMOM;
