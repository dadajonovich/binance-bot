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
// const period = 48;

const bot = new TelegramBot(telegramBotToken);

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

(async () => {
  pairsToMonitor = await getTopPairs(client);
})();

async function checkPriceChanges() {
  let message = '';

  for (const pair of pairsToMonitor) {
    const candles = await client.candles({
      symbol: pair,
      interval: intervalToMonitor,
      limit: 36,
    });

    const closePrices = candles.map((candle) => parseFloat(candle.close));
    const volumes = candles.map((candle) => parseFloat(candle.quoteVolume));
    const currentPrice = closePrices.at(-1);
    const tipicalPrice = candles.map(
      (candle) =>
        (parseFloat(candle.high) +
          parseFloat(candle.low) +
          parseFloat(candle.close)) /
        3
    );

    const openPrice = candles.map((candle) => parseFloat(candle.open));
    const highPrice = candles.map((candle) => parseFloat(candle.high));
    const lowPrice = candles.map((candle) => parseFloat(candle.low));

    const sma = ta.sma(closePrices).at(-1);
    const ema = ta.ema(closePrices).at(-1);
    const wma = ta.wma(closePrices).at(-1);
    const vwma = ta
      .vwma(closePrices.map((price, index) => [price, volumes[index]]))
      .at(-1);

    const macd = ta.macd(closePrices);
    const rsi = ta.rsi(closePrices);

    const vwap = ta
      .vwap(
        tipicalPrice.map((tipicalPrice, index) => [
          tipicalPrice,
          volumes[index],
        ])
      )
      .at(-1);

    const bop = ta.bop(
      openPrice.map((openPrice, index) => [
        openPrice,
        highPrice[index],
        lowPrice[index],
        closePrices[index],
      ])
    );

    const bollinger = ta.bands(closePrices);

    const [lastUpper, lastMiddle, lastLower] = bollinger[bollinger.length - 1];
    const [penultimateUpper, penultimateMiddle, penultimateLower] =
      bollinger[bollinger.length - 2];

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

    if (macd.at(-1) > 0 && macd.at(-2) < 0) {
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

          `- RSI ${rsi.at(-2).toFixed(2)} to ${rsi.at(-1).toFixed(2)}`,

          `- MACD ${macd.at(-2).toFixed(2)} to ${macd.at(-1).toFixed(2)}`,

          `- Bollinger Bands U${penultimateUpper.toFixed(
            2
          )}/M${penultimateMiddle.toFixed(2)}/L${penultimateLower.toFixed(
            2
          )} to U${lastUpper.toFixed(2)}/M${lastMiddle.toFixed(
            2
          )}/L${lastLower.toFixed(2)}`,

          `- BOP ${bop.at(-2).toFixed(2)} to ${bop.at(-1).toFixed(2)}`,
        ].join('\n') + '\n\n';
    }
  }

  if (message !== '') {
    bot.sendMessage(telegramChatId, message);
  } else {
    bot.sendMessage(telegramChatId, 'В Багдаде все спокойно...');
  }
}

setInterval(checkPriceChanges, 10 * 1000);
