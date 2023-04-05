const getMessage = (MA, arr, fnCreateMessage, { currentPrice } = {}) => {
  const str = fnCreateMessage(MA, arr, { currentPrice });

  return str;
};

module.exports = getMessage;
