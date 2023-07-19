const { client, bot, TELEGRAM_CHAT_ID, parameters } = require('./config');

const {
  getSMA,
  getStandartDeviation,
  getEMA,
  getATR,
  getKeltner,
  getMACD,
  getMOM,
  getParabolic,
  getOBV,
  getRSI,
} = require('./ta.js/indexTA');

// Message
const {
  getBalanceMessage,
  getStrCoinsInfo,
  getOrdersMessage,
  getDifferenceBalanceMessage,
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
  searchSignal,
  cancelOrders,
  filterCoins,
  orderExist,
  createBuyOrder,
  createSellOrder,
  tradeAlgo,
} = require('./algo/indexAlgo');

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

const curryGetCandles = getCandles(client, parameters);

const curryGetCoins = getCoins(
  curryGetCandles,
  getPrice,
  getSMA,
  getStandartDeviation,
  getATR,
  getEMA,
  getKeltner,
  getMACD,
  getMOM,
  getParabolic,
  getOBV,
  getRSI
);

const curryCreateBuyOrder = createBuyOrder(
  client,
  getValuesForOrder,
  createOrder,
  orderExist,
  getOpenOrders,
  cancelOrders
);

const curryCreateSellOrder = createSellOrder(
  client,
  curryGetCoins,
  getValuesForOrder,
  createOrder,
  orderExist,
  getOpenOrders,
  cancelOrders
);

const curryTradeAlgo = tradeAlgo(
  client,
  getBalance,
  getLotParams,
  getOpenOrders,
  orderExist,
  curryCreateBuyOrder,
  curryCreateSellOrder
);

const currySearchSignal = searchSignal(
  curryGetCoins,
  filterCoins,
  currySendMessage,
  curryTradeAlgo
);

bot.on('message', async (msg) => {
  await currySendMessage('Ща все будет...');

  let orders;
  let balance;
  let coins;
  let filteredCoins;
  let topPairs;

  const cycle = async () => {
    const { balanceFree: prevBalance } = await getBalance(client, 'USDT');
    const result = await currySearchSignal(topPairs);
    if (result) {
      const { balanceFree: currentBalace } = await getBalance(client, 'USDT');
      const diffBalance = getDifferenceBalanceMessage(
        prevBalance,
        currentBalace
      );
      await currySendMessage(diffBalance);
      console.log('restart tradeAlgo');
      setTimeout(cycle, 5000);
    }
  };

  switch (msg.text) {
    case '/tellme':
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs);
      filteredCoins = filterCoins(coins);
      await currySendMessage(`${filteredCoins[0]?.pair}`);
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
      cycle();
      break;

    default:
      break;
  }
});
