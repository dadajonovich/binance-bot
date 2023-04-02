const TelegramBot = require('node-telegram-bot-api');
const getConfig = require('./config.js');

const { telegramBotToken, telegramChatId } = getConfig();

const bot = new TelegramBot(telegramBotToken);

module.exports = { bot, telegramChatId };
