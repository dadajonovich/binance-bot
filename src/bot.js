const { client, bot, telegramChatId, parameters } = require('./config');

const {
  getSMA,
  getEMA,
  getHULL,
  getMACD,
  getRSI,
  getOBV,
  getVWAP,
  percentageDiffernce,
  getStandartDeviation,
} = require('./ta.js/indexTA');

// Message
const {
  getBalanceMessage,
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate,
  getStrCoinsInfo,
  getOrdersMessage,
  templateMessageBollinger,
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

const currySendMessage = sendMessage(telegramChatId);

const curryGetStrCoinsInfo = getStrCoinsInfo(
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate
);

const curryGetCoins = getCoins(
  client,
  getCandles,
  getPrice,
  getSMA,
  getEMA,
  getHULL,
  getMACD,
  getRSI,
  getOBV,
  getVWAP,
  getStandartDeviation,
  percentageDiffernce
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
  cancelOrders,
  percentageDiffernce
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balance;
  let coins;
  let filteredCoins;
  let topPairs;
  let resultMonitor;

  const tradeAlgo = async () => {
    filteredCoins = [];
    console.log('start tradeAlgo');
    await new Promise((resole) => {
      const searchCoins = setInterval(async () => {
        console.log('tick searchCoins');
        coins = await curryGetCoins(topPairs, parameters);
        filteredCoins = filterCoins(coins);
        if (filteredCoins.length > 0) {
          clearInterval(searchCoins);
          resole();
        }
      }, 1 * 60 * 1000);
    });
    await currySendMessage(curryGetStrCoinsInfo(filteredCoins));
    resultMonitor = await curryMonitorPrice(filteredCoins);
    console.log(`resultMonitor - ${resultMonitor}`);
    if (resultMonitor.every((elem) => elem === true) || resultMonitor === []) {
      console.log('restart tradeAlgo');
      tradeAlgo();
    }
  };

  switch (msg.text) {
    case '/tellme':
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs, parameters);
      filteredCoins = filterCoins(coins);
      await currySendMessage(curryGetStrCoinsInfo(filteredCoins));
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
      tradeAlgo();

      break;

    default:
      break;
  }
});
