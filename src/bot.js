const TelegramBot = require('node-telegram-bot-api');
const Binance = require('binance-api-node').default;

// Keys and objects
const {
  binanceApiKey,
  binanceApiSecret,
  telegramBotToken,
  telegramChatId,
} = require('./config');

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

const bot = new TelegramBot(telegramBotToken, { polling: true });

// Parameters
const intervalToMonitor = '1d';
const period = 28;
const quantityPairs = 50;

// Functions
const getTopPairs = require('./get_data/getTopPairs');
const getCoins = require('./get_data/getCoins');
const getStrCoinsInfo = require('./get_data/getStrCoinsInfo');

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
  }
});
