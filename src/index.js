const { bot, monitorPrices } = require('./telegram.js');
const getConfig = require('./config.js');

const { telegramChatId } = getConfig();

// Запускаем бота
bot.sendMessage(telegramChatId, 'Бот запущен!');

// Мониторим цены
monitorPrices();
