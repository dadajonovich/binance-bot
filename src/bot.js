const { client, bot, telegramChatId, parameters } = require('./config');

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
  getPrices,
  getTopPairs,
  getLotParams,
  getValuesForOrder,
} = require('./get_data/indexGetData');

// TA
const {
  getVolatility,
  getSMA,
  getEMA,
  getMACD,
  getRSI,
} = require('./ta/indexTA');

// Algo
const {
  getTrackedCoins,
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

const curryGetCoins = getCoins(
  client,
  parameters,
  getCandles,
  getPrices,
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getVolatility
);

const curryGetStrCoinsInfo = getStrCoinsInfo(
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate
);

const curryMonitorPrice = monitorPrice(
  client,
  getCandles,
  getPrices,
  {},
  createOrder,
  getBalance,
  getValuesForOrder,
  getOpenOrders
);

const curryGetTrackedCoins = getTrackedCoins(client, getLotParams);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');
  if (msg.text === '/tellme') {
    const topPairs = await getTopPairs(client, parameters);
    const coins = await curryGetCoins(topPairs);
    const message = curryGetStrCoinsInfo(coins);
    await currySendMessage(message);
  } else if (msg.text === '/balance') {
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
    let topPairs = await getTopPairs(client, parameters);
    let coins = await curryGetCoins(['RLCUSDT']);
    let trackedCoins = await curryGetTrackedCoins(coins[0]);
    curryMonitorPrice(trackedCoins);

    setInterval(async () => {
      console.log('Get new pair...');
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(['RLCUSDT']);
      trackedCoins = await curryGetTrackedCoins(coins[0]);
    }, 24 * 60 * 60 * 1000);

    setInterval(async () => {
      console.log('U mirin brah?');
      if (trackedCoins === {}) {
        topPairs = await getTopPairs(client, parameters);
        coins = await curryGetCoins(['RLCUSDT']);
        trackedCoins = await curryGetTrackedCoins(coins[0]);
      }
      curryMonitorPrice(trackedCoins);
    }, 1 * 60 * 1000);
  }
});
