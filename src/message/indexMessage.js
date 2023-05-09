const templateMessageMA = require('./templateMessageMA');
const templateMessageIndicator = require('./templateMessageIndicator');
const getMessageInfoTemplate = require('./getMessageInfoTemplate');
const getStrCoinsInfo = require('./getStrCoinsInfo');
const getBalanceMessage = require('./getBalanceMessage');
const getOrdersMessage = require('./getOrdersMessage');
const templateMessageBollinger = require('./templateMessageBollinger');

module.exports = {
  getBalanceMessage,
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate,
  getStrCoinsInfo,
  getOrdersMessage,
  templateMessageBollinger,
};
