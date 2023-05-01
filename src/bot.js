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
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
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
  getVolatility,
  getLotParams
);

const curryMonitorPrice = monitorPrice(
  client,
  createOrder,
  getBalance,
  getValuesForOrder,
  getOpenOrders,
  cancelOrders
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balanceUSDT;
  let coins;
  let topPairs;

  switch (msg.text) {
    case '/tellme':
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs);
      await currySendMessage(curryGetStrCoinsInfo(coins));
      break;

    case '/balance':
      balanceUSDT = await getBalance(client);
      await currySendMessage(getBalanceMessage(balanceUSDT));
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
      orders = await getOpenOrders(client);
      if (orders.length === []) return;
      balanceUSDT = await getBalance(client);
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs);
      await curryMonitorPrice(coins, balanceUSDT);

      setInterval(async () => {
        console.log('U mirin brah?');
        orders = await getOpenOrders(client);
        if (orders.length === []) return;
        balanceUSDT = await getBalance(client);
        coins = await curryGetCoins(topPairs);
        await curryMonitorPrice(coins, balanceUSDT);
      }, 5 * 60 * 1000);
      break;

    default:
      break;
  }
});
