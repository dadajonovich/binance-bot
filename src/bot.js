const { client, bot, telegramChatId, parameters } = require('./config');

const {
  getSMA,
  getEMA,
  getMACD,
  getRSI,
  getOBV,
  percentageDiffernce,
  getVWMA,
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
  getVWMA,
  getMACD,
  getRSI,
  getOBV
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
  createSellOrder
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balance;
  let coins;
  let filteredCoins;
  let topPairs;

  const tradeAlgo = async () => {
    topPairs = await getTopPairs(client, parameters);
    setTimeout(async () => {
      console.log('Start tradeAlgo');
      await new Promise((resole) => {
        const searchCoins = setInterval(async () => {
          console.log('Start searchCoins');
          coins = await curryGetCoins(topPairs, parameters);
          filteredCoins = filterCoins(coins, percentageDiffernce);
          if (filteredCoins.length > 0) {
            clearInterval(searchCoins);
            resole();
          }
        }, 5 * 60 * 1000);
      });
      await currySendMessage(curryGetStrCoinsInfo(filteredCoins));
      await curryMonitorPrice(filteredCoins);
      console.log('Restart tradeAlgo');
      await tradeAlgo();
    }, 5 * 1000);
  };

  switch (msg.text) {
    case '/tellme':
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs, parameters);
      filteredCoins = filterCoins(coins, percentageDiffernce);
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
      await tradeAlgo();

      break;

    default:
      break;
  }
});
