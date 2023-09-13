import { client, bot, TELEGRAM_CHAT_ID, parameters, pairs } from './config.js';

import {
  getKAMA,
  getFilter,
  getATR,
  getBollinger,
  getEMA,
  getKeltner,
} from './ta/indexTA.js';

// Message
import {
  getBalanceMessage,
  getOrdersMessage,
  getDifferenceBalanceMessage,
} from './message/indexMessage.js';

// Get functions
import {
  getBalance,
  getCandles,
  getCoins,
  getOpenOrders,
  getPrice,
  getLotParams,
  getValuesForOrder,
} from './get_data/indexGetData.js';

// Algo
import {
  createOrder,
  searchSignal,
  cancelOrders,
  filterCoins,
  orderExist,
  createBuyOrder,
  createSellOrder,
  tradeAlgo,
  composeCreateOrder,
} from './algo/indexAlgo.js';

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
  getKAMA,
  getATR,
  getFilter
);
const curryComposeCreateOrder = composeCreateOrder(
  client,
  getValuesForOrder,
  createOrder
);

const curryCreateBuyOrder = createBuyOrder(
  client,
  orderExist,
  getOpenOrders,
  cancelOrders,
  curryComposeCreateOrder,
  getBalance,
  currySendMessage
);

const curryCreateSellOrder = createSellOrder(
  client,
  curryGetCoins,
  orderExist,
  getOpenOrders,
  cancelOrders,
  curryComposeCreateOrder,
  getBalance,
  currySendMessage
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
  curryTradeAlgo
);

bot.on('message', async (msg) => {
  let orders;
  let balance;
  let coins;
  let filteredCoins;

  const cycle = async () => {
    const { balanceFree: prevBalance } = await getBalance(client, 'USDT');
    const result = await currySearchSignal(pairs);
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
      coins = await curryGetCoins(pairs);
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
      await currySendMessage('Ща все будет...');
      cycle();
      break;

    default:
      break;
  }
});
