const ta = require('ta.js');

const getEnvelope = (closePrices, length = 20, percentage = 0.03) => {
  const envelope = ta.envelope(closePrices, length, percentage);
  return envelope;
};

module.exports = getEnvelope;
