const { client, bot, telegramChatId, parameters } = require('./config');

// Message
const {
  getBalanceMessage,
  getOrdersMessage,
} = require('./message/indexMessage');

// Get functions
const {
  getBalance,
  getCandles,
  getCoin,
  getOpenOrders,
  getPrice,
  getLotParams,
  getValuesForOrder,
} = require('./get_data/indexGetData');

// Algo
const { monitorPrice, createOrder, cancelOrders } = require('./algo/indexAlgo');

// Compose
const sendMessage = (chatId) => async (message) => {
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
};

// Currying

const currySendMessage = sendMessage(telegramChatId);

const curryGetCoin = getCoin(
  client,
  parameters,
  getCandles,
  getPrice,
  getLotParams
);

const curryMonitorPrice = monitorPrice(
  client,
  getCandles,
  getPrice,
  {},
  createOrder,
  getBalance,
  getValuesForOrder,
  getOpenOrders,
  cancelOrders
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balance;
  let coin;

  switch (msg.text) {
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
      coin = await curryGetCoin('RLCUSDT');
      curryMonitorPrice(coin);

      setInterval(async () => {
        console.log('U mirin brah?');
        curryMonitorPrice(coin);
      }, 1 * 60 * 1000);
      break;

    default:
      break;
  }
});
