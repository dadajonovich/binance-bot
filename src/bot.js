const { client, bot, telegramChatId, parameters } = require('./config');

const {
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getVolatility,
} = require('./ta.js/indexTA');

// Message
const {
  getBalanceMessage,
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate,
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
const { monitorPrice, createOrder, cancelOrders } = require('./algo/indexAlgo');

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

const currySendMessage = sendMessage(telegramChatId);

const curryGetStrCoinsInfo = getStrCoinsInfo(
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate
);

const curryGetCoins = getCoins(
  client,
  parameters,
  getCandles,
  getPrice,
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getVolatility
);

const curryMonitorPrice = monitorPrice(
  client,
  createOrder,
  getBalance,
  getLotParams,
  getValuesForOrder,
  getOpenOrders,
  cancelOrders
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balanceUSDT;
  let balance;
  let coins;
  let topPairs;

  switch (msg.text) {
    case '/tellme':
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs);
      await currySendMessage(curryGetStrCoinsInfo(coins));
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
      coins = await curryGetCoins(topPairs);
      await currySendMessage(curryGetStrCoinsInfo(coins));
      await curryMonitorPrice(coins);

      // setInterval(async () => {
      //   coins = await curryGetCoins(topPairs);
      //   await currySendMessage(curryGetStrCoinsInfo(coins));
      // }, 4 * 60 * 60 * 1000);

      setInterval(async () => {
        console.log('U mirin brah?');
        await curryMonitorPrice(coins);
        coins = await curryGetCoins(topPairs);
      }, 5 * 60 * 1000);
      break;

    default:
      break;
  }
});
