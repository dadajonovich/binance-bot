const ta = require('ta.js');

const getMOM = (value) => {
  const mom = ta.mom(value);
  return mom;
};

module.exports = getMOM;
