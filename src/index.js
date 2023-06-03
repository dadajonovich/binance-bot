const { client, bot, TELEGRAM_CHAT_ID, parameters } = require('./config');

const {
  getEnvelope,
  getKeltner,
  getStandartDeviation,
} = require('./ta.js/indexTA');

// Message
const {
  getBalanceMessage,
  getStrCoinsInfo,
  getOrdersMessage,
} = require('./message/indexMessage');

// Get functions
const {
  getBalance,
  getCandles,
  getCoins,
  getOpenOrders,
  getPrice,
  getLotParams,
  getValuesForOrder,
  getTopPairs,
} = require('./get_data/indexGetData');

// Algo
const {
  createOrder,
  monitorPrice,
  cancelOrders,
  filterCoins,
  orderExist,
  createBuyOrder,
  createSellOrder,
  tradeAlgo,
} = require('./algo/indexAlgo');

// Compose
const sendMessage = (chatId) => async (message) => {
  try {
    await bot.sendMessage(
      chatId,
      message !== '' ? message : 'В Багдаде все спокойно...'
    );
  } catch (err) {
    console.error('Error in sendMessage', err);
  }
};

// Currying

const currySendMessage = sendMessage(TELEGRAM_CHAT_ID);

const curryGetCoins = getCoins(
  client,
  getCandles,
  getPrice,
  getEnvelope,
  getKeltner,
  getStandartDeviation
);

const curryMonitorPrice = monitorPrice(
  client,
  createOrder,
  getBalance,
  getLotParams,
  getValuesForOrder,
  getOpenOrders,
  orderExist,
  curryGetCoins,
  createBuyOrder,
  createSellOrder,
  cancelOrders
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balance;
  let coins;
  let filteredCoins;
  let topPairs;

  switch (msg.text) {
    case '/tellme':
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs, parameters);
      filteredCoins = filterCoins(coins);
      await currySendMessage(getStrCoinsInfo(filteredCoins));
      break;

    case '/balance':
      balance = await getBalance(client);
      await currySendMessage(getBalanceMessage(balance));
      break;

    case '/orders':
      orders = await getOpenOrders(client);
      await currySendMessage(getOrdersMessage(orders));
      break;

    case '/cancel':
      orders = await getOpenOrders(client);
      await cancelOrders(client, orders);
      break;

    case '/start':
      topPairs = await getTopPairs(client, parameters);
      tradeAlgo(
        curryGetCoins,
        topPairs,
        parameters,
        filterCoins,
        currySendMessage,
        getStrCoinsInfo,
        curryMonitorPrice
      );

      break;

    default:
      break;
  }
});
