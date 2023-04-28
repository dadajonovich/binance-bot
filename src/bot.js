const { client, bot, telegramChatId, parameters } = require('./config');

// Message
const {
  getBalanceMessage,
  templateMessageIndicator,
  templateMessageMA,
  getMessageInfoTemplate,
  getStrCoinsInfo,
} = require('./message/indexMessage');

// Get functions
const {
  getBalance,
  getCandles,
  getCoins,
  getOpenOrders,
  getPrices,
  getTopPairs,
} = require('./get_data/indexGetData');

// TA
const {
  getVolatility,
  getSMA,
  getEMA,
  getMACD,
  getRSI,
} = require('./ta/indexTA');

const { getTrackedCoins, monitorPrice } = require('./algo/algo');

const createOrder = require('./algo/createOrder');

// Compose
async function sendPriceChanges(chatId, message) {
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
}

// Currying
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
  createOrder,
  getBalance
);

bot.on('message', async (msg) => {
  await bot.sendMessage(telegramChatId, 'Ща все будет...');
  if (msg.text === '/tellme') {
    const topPairs = await getTopPairs(client, parameters);
    const coins = await curryGetCoins(topPairs);
    const message = curryGetStrCoinsInfo(coins);
    await sendPriceChanges(telegramChatId, message);
  } else if (msg.text === '/balance') {
    const balance = await getBalance(client);
    const message = getBalanceMessage(balance);
    await sendPriceChanges(telegramChatId, message);
  } else if (msg.text === '/orders') {
    const orders = await getOpenOrders(client);
  } else if (msg.text === '/start') {
    let topPairs = await getTopPairs(client, parameters);
    let coins = await curryGetCoins(topPairs);
    let trackedCoins = getTrackedCoins(coins);
    curryMonitorPrice(trackedCoins);
    setInterval(async () => {
      topPairs = await getTopPairs(client, parameters);
      coins = await curryGetCoins(topPairs);
      trackedCoins = getTrackedCoins(coins);
    }, 24 * 60 * 60 * 1000);

    setInterval(async () => {
      curryMonitorPrice(trackedCoins);
    }, 5 * 60 * 1000); // every 5 min
  }
});
