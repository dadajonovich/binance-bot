const TelegramBot = require('node-telegram-bot-api');
const Binance = require('binance-api-node').default;

const {
  binanceApiKey,
  binanceApiSecret,
  telegramBotToken,
  telegramChatId,
} = require('./config.js');

const getTopPairs = require('./getTopPairs.js');

const checkPriceChanges = require('./checkPriceChanges.js');

let pairsToMonitor = [];
const intervalToMonitor = '1d';
const period = 26;
const quantityPairs = 150;

const bot = new TelegramBot(telegramBotToken, { polling: true });

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

// Каррирование

const checkOneCoin = (coin) =>
  checkPriceChanges(client, coin, intervalToMonitor, period);

const checkTopCoins = (topPairs) =>
  checkPriceChanges(client, topPairs, intervalToMonitor, period);

async function sendPriceChanges(chatId, messages) {
  const message = messages.join('');
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
}

bot.on('message', async (msg) => {
  await bot.sendMessage(telegramChatId, 'Ща все будет...');
  if (msg.text === '/tellme') {
    const topPairs = await getTopPairs(client, quantityPairs);
    const messages = await checkTopCoins(topPairs);
    await sendPriceChanges(telegramChatId, messages);
  }
});
