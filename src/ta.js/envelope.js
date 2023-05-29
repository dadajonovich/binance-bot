const ta = require('ta.js');

const getEnvelope = (closePrices, length = 9, percentage = 0.015) => {
  const envelope = ta.envelope(closePrices, length, percentage);
  return envelope;
};

module.exports = getEnvelope;
