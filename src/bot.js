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
const getSMA = require('./ta/sma.js');
const getEMA = require('./ta/ema.js');
const getWMA = require('./ta/wma.js');
const getVWAP = require('./ta/vwap.js');
const getVWMA = require('./ta/vwma.js');
const getMACD = require('./ta/macd.js');
const getRSI = require('./ta/rsi.js');
const getBollinger = require('./ta/bollinger.js');
const getBOP = require('./ta/bop.js');
let pairsToMonitor = [];
const intervalToMonitor = '1d';
const period = 28;
const quantityPars = 150;

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
    const macd = getMACD(prices);

    if (macd) {
      bot.sendMessage(telegramChatId, 'В Багдаде все спокойно...');
      return;
    }

    const sma = getSMA(prices);
    const ema = getEMA(prices);
    const wma = getWMA(prices);
    const vwap = getVWAP(prices);
    const vwma = getVWMA(prices);

    const rsi = getRSI(prices);
    const bollinger = getBollinger(prices);
    const bop = getBOP(prices);

    message += `\n${pair}
    - Текущая цена: ${prices.currentPrice.toFixed(2)} USDT
    ${sma}
    ${ema}
    ${wma}
    ${vwap}
    ${vwma}
    ${macd}
    ${rsi}
    ${bollinger}
    ${bop}
      `;

    bot.sendMessage(telegramChatId, message);
  }
}

setInterval(checkPriceChanges, 10 * 1000);
