const { client, bot, telegramChatId, parameters } = require('./config');

// Message
const getStrCoinsInfo = require('./message/getStrCoinsInfo');
const getBalanceMessage = require('./message/getBalanceMessage');

// Functions
const {
  getTopPairs,
  getCoins,
  getBalance,
  getOpenOrders,
} = require('./get_data/indexGetData');

const { getTrackedCoins, monitorPrice } = require('./algo/algo');

// Compose
async function sendPriceChanges(chatId, message) {
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
}

bot.on('message', async (msg) => {
  await bot.sendMessage(telegramChatId, 'Ща все будет...');
  if (msg.text === '/tellme') {
    const topPairs = await getTopPairs(client, quantityPairs);
    const coins = await getCoins(client, topPairs, intervalToMonitor, period);
    const message = getStrCoinsInfo(coins);
    await sendPriceChanges(telegramChatId, message);
  } else if (msg.text === '/balance') {
    const balance = await getBalance(client);
    const message = getBalanceMessage(balance);
    await sendPriceChanges(telegramChatId, message);
  } else if (msg.text === '/orders') {
    const orders = await getOpenOrders(client);
  } else if (msg.text === '/start') {
    const topPairs = await getTopPairs(client, quantityPairs);
    const coins = await getCoins(client, topPairs, intervalToMonitor, period);
    const trackedCoins = getTrackedCoins(coins);
    await monitorPrice(trackedCoins);
  }
});
