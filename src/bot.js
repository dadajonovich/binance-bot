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

const getCriterion = require('./criterion.js');

let pairsToMonitor = [];
const intervalToMonitor = '1d';
const period = 28;
const quantityPairs = 5;

const bot = new TelegramBot(telegramBotToken, { polling: true });

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

async function sendPriceChanges(chatId, messages) {
  const message = messages.join('');
  await bot.sendMessage(
    chatId,
    message !== '' ? message : 'В Багдаде все спокойно...'
  );
}

bot.on('message', async (msg) => {
  if (msg.text === '/tellme') {
    await bot.sendMessage(telegramChatId, 'Ща все будет...');
    const topPairs = await getTopPairs(client, quantityPairs);
    const messages = await checkPriceChanges(
      client,
      topPairs,
      intervalToMonitor,
      period
    );
    await sendPriceChanges(telegramChatId, messages);
  }
});
