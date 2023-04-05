const TelegramBot = require('node-telegram-bot-api');
const Binance = require('binance-api-node').default;

const {
  binanceApiKey,
  binanceApiSecret,
  telegramBotToken,
  telegramChatId,
} = require('./config.js');

const getTopPairs = require('./getTopPairs.js');

const getCoins = require('./getCoins.js');
const getStrCoinsInfo = require('./getStrCoinsInfo.js');

const intervalToMonitor = '1d';
const period = 26;
const quantityPairs = 5;

const bot = new TelegramBot(telegramBotToken, { polling: true });

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

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
