const TelegramBot = require('node-telegram-bot-api');
const getConfig = require('./config.js');
const getCurrentPrice = require('./binance.js');

const { telegramBotToken, telegramChatId, pairsToMonitor } = getConfig();

const bot = new TelegramBot(telegramBotToken);

async function monitorPrices() {
  for (const pair of pairsToMonitor) {
    const price = await getCurrentPrice(pair);
    bot.sendMessage(telegramChatId, `${pair}: ${price}`);
  }
}

module.exports = { bot, monitorPrices };
