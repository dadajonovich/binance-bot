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
  getVWAP,
  getVWMA,
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

let pairsToMonitor = [];
const intervalToMonitor = '1d';
const period = 28;
const quantityPars = 5;

const bot = new TelegramBot(telegramBotToken);

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

async function checkPriceChanges() {
  let message = '';
  const topPairs = await getTopPairs(client, quantityPars);

  for (const pair of topPairs) {
    const candles = await getCandles(pair, client, intervalToMonitor, period);
    const prices = getPrices(candles);

    const sma = getSMA(prices);
    const smaMessage = getMessage('SMA', sma, templateMessageMA, prices);

    const ema = getEMA(prices);
    const emaMessage = getMessage('EMA', ema, templateMessageMA, prices);

    const macd = getMACD(prices);
    const macdMessage = getMessage('MACD', macd, templateMessageIndicator);

    const rsi = getRSI(prices);
    const rsiMessage = getMessage('RSI', rsi, templateMessageIndicator);
    const bop = getBOP(prices);
    const bopMessage = getMessage('BOP', bop, templateMessageIndicator);

    // const wma = getWMA(prices);
    // const vwap = getVWAP(prices);
    // const vwma = getVWMA(prices);

    // const bollinger = getBollinger(prices);

    message += `\n${pair}
- Текущая цена: ${prices.currentPrice.toFixed(2)}
${smaMessage}
${emaMessage}
${macdMessage}
${rsiMessage}
${bopMessage}
      `;
  }
  if (message !== '') {
    bot.sendMessage(telegramChatId, message);
  } else {
    bot.sendMessage(telegramChatId, 'В Багдаде все спокойно...');
  }
}

setInterval(checkPriceChanges, 10 * 1000);
