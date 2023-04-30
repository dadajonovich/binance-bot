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
const {
  getTrackedCoin,
  monitorPrice,
  createOrder,
  cancelOrders,
} = require('./algo/indexAlgo');

// Compose
const sendMessage = (chatId) => async (message) => {
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
};

// Currying

const currySendMessage = sendMessage(telegramChatId);

const curryGetCoin = getCoin(client, parameters, getCandles, getPrice);

const curryMonitorPrice = monitorPrice(
  client,
  getCandles,
  getPrice,
  {},
  createOrder,
  getBalance,
  getValuesForOrder,
  getOpenOrders
);

const curryGetTrackedCoin = getTrackedCoin(client, getLotParams);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');
  if (msg.text === '/balance') {
    const balance = await getBalance(client);
    const message = getBalanceMessage(balance);
    await currySendMessage(message);
  } else if (msg.text === '/orders') {
    const orders = await getOpenOrders(client);
    const message = getOrdersMessage(orders);
    await currySendMessage(message);
  } else if (msg.text === '/cancel') {
    const orders = await getOpenOrders(client);
    await cancelOrders(client, orders);
  } else if (msg.text === '/start') {
    let coin = await curryGetCoin('ETHUSDT');
    let trackedCoins = await curryGetTrackedCoin(coin);
    curryMonitorPrice(trackedCoins);

    setInterval(async () => {
      console.log('Get new pair...');
      coin = await curryGetCoin('ETHUSDT');
      trackedCoins = await curryGetTrackedCoin(coin);
    }, 24 * 60 * 60 * 1000);

    setInterval(async () => {
      console.log('U mirin brah?');
      if (trackedCoins === {}) {
        coin = await curryGetCoin('ETHUSDT');
        trackedCoins = await curryGetTrackedCoin(coin);
      }
      curryMonitorPrice(trackedCoins);
    }, 1 * 60 * 1000);
  }
});
