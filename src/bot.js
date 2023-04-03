const TelegramBot = require('node-telegram-bot-api');
const Binance = require('binance-api-node').default;
const ta = require('ta.js');
const getTopPairs = require('./getTopPairs.js');

const binanceApiKey =
  'Mwyek91lg0az1UUzh5W8ql2FZTtoDgQXqKei12yVt3AvKnASRMWbDenGle6cCXCj';
const binanceApiSecret =
  '85VgZUt5RlY9ZX79V5BHZELLv1gIIPOeksZzD1ROtIt4RI8J9aOVkFCO3XZ7XkeU';
const telegramBotToken = '6057048590:AAH1Yi8k_sZuifJ-y2sBbg76bCc7miV4kaA';
const telegramChatId = '521450044';
let pairsToMonitor = [];

const intervalToMonitor = '1d';
const period = 24;

const bot = new TelegramBot(telegramBotToken);

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

async function checkPriceChanges() {
  let message = '';
  pairsToMonitor = await getTopPairs(client);
  for (const pair of pairsToMonitor) {
    const candles = await client.candles({
      symbol: pair,
      interval: intervalToMonitor,
      limit: period,
    });

    const closePrices = candles.map((candle) => parseFloat(candle.close));
    const volumes = candles.map((candle) => parseFloat(candle.quoteVolume));
    const currentPrice = closePrices[period - 1];
    const openPrice = candles.map((candle) => parseFloat(candle.open));
    const highPrice = candles.map((candle) => parseFloat(candle.high));
    const lowPrice = candles.map((candle) => parseFloat(candle.low));
    const tipicalPrice = candles.map(
      (candle) =>
        (parseFloat(candle.high) +
          parseFloat(candle.low) +
          parseFloat(candle.close)) /
        3
    );

    const sma = ta.sma(closePrices, period)[0];
    const ema = ta.ema(closePrices, period)[0];
    const wma = ta.wma(closePrices, period)[0];
    const macd = ta.macd(closePrices, 12, 24)[0];
    const rsi = ta.rsi(closePrices, period)[0];
    const vwma = ta.vwma(
      closePrices.map((price, index) => [price, volumes[index]]),
      period
    )[0];

    const bop = ta.bop(
      openPrice.map((openPrice, index) => [
        openPrice,
        highPrice[index],
        lowPrice[index],
        closePrices[index],
      ]),
      period
    )[0];

    const vwap = ta.vwap(
      tipicalPrice.map((tipicalPrice, index) => [tipicalPrice, volumes[index]]),
      period
    )[0];

    const percentDifferenceFromSMA =
      ((sma - currentPrice) / currentPrice) * 100;
    const percentDifferenceFromEMA =
      ((ema - currentPrice) / currentPrice) * 100;
    const percentDifferenceFromWMA =
      ((wma - currentPrice) / currentPrice) * 100;
    const percentDifferenceFromVWMA =
      ((vwma - currentPrice) / currentPrice) * 100;
    const percentDifferenceFromVWAP =
      ((vwap - currentPrice) / currentPrice) * 100;

    if (percentDifferenceFromSMA < -10) {
      // if (true) {
      message += `${pair}:\n`;
      message +=
        [
          `- Текущая цена: ${currentPrice.toFixed(2)}`,

          `- SMA ${sma.toFixed(2)} / ${percentDifferenceFromSMA.toFixed(2)}%`,

          `- EMA ${ema.toFixed(2)} / ${percentDifferenceFromEMA.toFixed(2)}%`,

          `- WMA ${wma.toFixed(2)} / ${percentDifferenceFromWMA.toFixed(2)}%`,

          `- VWMA ${vwma.toFixed(2)} / ${percentDifferenceFromVWMA.toFixed(
            2
          )}%`,

          `- VWAP ${vwap.toFixed(2)} / ${percentDifferenceFromVWAP.toFixed(
            2
          )}%`,

          `- RSI ${rsi.toFixed(2)}%`,

          `- MACD ${macd.toFixed(2)}`,

          `- Balance Of Power ${bop.toFixed(2)}`,
        ].join('\n') + '\n\n';
    }
  }

  if (message !== '') {
    bot.sendMessage(telegramChatId, message);
  } else {
    bot.sendMessage(telegramChatId, 'В Багдаде все спокойно...');
  }
}

setInterval(checkPriceChanges, 5000);
