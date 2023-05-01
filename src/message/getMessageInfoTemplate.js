const getMessageInfoTemplate = (
  MA,
  arr,
  fnCreateMessage,
  { currentPrice } = {}
) => fnCreateMessage(MA, arr, { currentPrice });

module.exports = getMessageInfoTemplate;
