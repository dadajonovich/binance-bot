const TelegramBot = require('node-telegram-bot-api');
const Binance = require('binance-api-node').default;

const getTopPairs = require('./getTopPairs.js');
const {
  binanceApiKey,
  binanceApiSecret,
  telegramBotToken,
  telegramChatId,
} = require('./config.js');

const getCandles = require('./getCandles.js');
const getPrices = require('./getPrices.js');
const {
  getSMA,
  getEMA,
  getWMA,
  getVWMA,
  getVWAP,
  getMACD,
  getRSI,
  getBollinger,
  getBOP,
} = require('./ta/indexTA');

const {
  templateMessageIndicator,
  templateMessageMA,
  getMessage,
} = require('./createMessage');

const getCriterion = require('./criterion.js');

let pairsToMonitor = [];
const intervalToMonitor = '1d';
const period = 28;
const quantityPars = 5;

const bot = new TelegramBot(telegramBotToken, { polling: true });

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

async function checkPriceChanges() {
  const topPairs = await getTopPairs(client, quantityPars);

  const messages = await Promise.all(
    topPairs.map(async (pair) => {
      const candles = await getCandles(pair, client, intervalToMonitor, period);
      const prices = getPrices(candles);

      return `\n${pair}
- Текущая цена: ${prices.currentPrice.toFixed(2)}
${getMessage('SMA', getSMA(prices), templateMessageMA, prices)}
${getMessage('EMA', getEMA(prices), templateMessageMA, prices)}
${getMessage('WMA', getWMA(prices), templateMessageMA, prices)}
${getMessage('WWMA', getVWMA(prices), templateMessageMA, prices)}
${getMessage('VWAP', getVWAP(prices), templateMessageMA, prices)}
${getMessage('MACD', getMACD(prices), templateMessageIndicator)}
${getMessage('RSI', getRSI(prices), templateMessageIndicator)}
${getMessage('BOP', getBOP(prices), templateMessageIndicator)}
`;
    })
  );
  return messages;
}

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
    const messages = await checkPriceChanges();
    await sendPriceChanges(telegramChatId, messages);
  }
});
