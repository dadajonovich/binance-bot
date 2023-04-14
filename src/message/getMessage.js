const getMessage = (MA, arr, fnCreateMessage, { currentPrice } = {}) =>
  fnCreateMessage(MA, arr, { currentPrice });

module.exports = getMessage;
