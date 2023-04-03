const TelegramBot = require('node-telegram-bot-api');
const Binance = require('binance-api-node').default;

const binanceApiKey =
  'Mwyek91lg0az1UUzh5W8ql2FZTtoDgQXqKei12yVt3AvKnASRMWbDenGle6cCXCj';
const binanceApiSecret =
  '85VgZUt5RlY9ZX79V5BHZELLv1gIIPOeksZzD1ROtIt4RI8J9aOVkFCO3XZ7XkeU';
const telegramBotToken = '6057048590:AAH1Yi8k_sZuifJ-y2sBbg76bCc7miV4kaA';
const telegramChatId = '521450044';
let pairsToMonitor = [];

const intervalToMonitor = '1d';
const period = 12;

const bot = new TelegramBot(telegramBotToken);

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

function calculateSMA(closePrices, smaPeriod) {
  const sma =
    closePrices.slice(0, smaPeriod).reduce((sum, price) => sum + price, 0) /
    smaPeriod;
  return sma;
}

function calculateEMA(closePrices, emaPeriod) {
  const k = 2 / (emaPeriod + 1);
  let ema =
    closePrices.slice(0, emaPeriod).reduce((sum, val) => sum + val, 0) /
    emaPeriod;
  for (let i = emaPeriod; i < closePrices.length; i++) {
    ema = (closePrices[i] - ema) * k + ema;
  }
  return ema;
}

function calculateRSI(closePrices, rsiPeriod) {
  let averageGain = 0;
  let averageLoss = 0;

  for (let i = 1; i <= rsiPeriod; i++) {
    const diff = closePrices[i] - closePrices[i - 1];
    if (diff > 0) {
      averageGain += diff;
    } else {
      averageLoss += Math.abs(diff);
    }
  }
  averageGain /= rsiPeriod;
  averageLoss /= rsiPeriod;

  for (let i = rsiPeriod + 1; i < closePrices.length; i++) {
    const diff = closePrices[i] - closePrices[i - 1];
    if (diff > 0) {
      averageGain = (averageGain * (rsiPeriod - 1) + diff) / rsiPeriod;
      averageLoss = (averageLoss * (rsiPeriod - 1)) / rsiPeriod;
    } else {
      averageGain = (averageGain * (rsiPeriod - 1)) / rsiPeriod;
      averageLoss =
        (averageLoss * (rsiPeriod - 1) + Math.abs(diff)) / rsiPeriod;
    }
  }

  if (averageLoss === 0) {
    return 100;
  } else {
    const RS = averageGain / averageLoss;
    const RSI = 100 - 100 / (1 + RS);
    return RSI;
  }
}

function calculateWMA(closePrices, wmaPeriod) {
  let weightedSum = 0;
  let weightSum = 0;
  for (let i = 0; i < wmaPeriod; i++) {
    weightedSum += closePrices[i] * (wmaPeriod - i);
    weightSum += wmaPeriod - i;
  }
  return weightedSum / weightSum;
}

async function checkPriceChanges() {
  let message = '';
  for (const pair of pairsToMonitor) {
    const candles = await client.candles({
      symbol: pair,
      interval: intervalToMonitor,
      limit: period + 1,
    });

    const closePrices = candles.map((candle) => parseFloat(candle.close));
    const sma = calculateSMA(closePrices, period);
    const ema = calculateEMA(closePrices, period);
    const wma = calculateWMA(closePrices, period);
    const rsi = calculateRSI(closePrices, period);
    const currentPrice = closePrices[period];
    // const percentDifferenceFromSMA = ((currentPrice - sma) / sma) * 100;
    // const percentDifferenceFromEMA = ((currentPrice - ema) / ema) * 100;
    // const percentDifferenceFromWMA = ((currentPrice - wma) / wma) * 100;

    const percentDifferenceFromSMA =
      ((sma - currentPrice) / currentPrice) * 100;
    const percentDifferenceFromEMA =
      ((ema - currentPrice) / currentPrice) * 100;
    const percentDifferenceFromWMA =
      ((wma - currentPrice) / currentPrice) * 100;

    let priceStatus;
    if (sma > currentPrice) {
      priceStatus = '📈';
    } else {
      priceStatus = '📉';
    }
    if (
      percentDifferenceFromSMA < -20 &&
      percentDifferenceFromEMA < -20 &&
      percentDifferenceFromWMA < -20
    ) {
      message += `${pair}:\n`;
      message += `- Текущая цена: ${currentPrice.toFixed(2)}\n`;
      message += `- SMA ${sma.toFixed(
        2
      )} ${priceStatus} ${percentDifferenceFromSMA.toFixed(2)}%\n`;
      message += `- EMA ${ema.toFixed(
        2
      )} ${priceStatus} ${percentDifferenceFromEMA.toFixed(2)}%\n`;
      message += `- WMA ${wma.toFixed(
        2
      )} ${priceStatus} ${percentDifferenceFromWMA.toFixed(2)}%\n`;
      message += `- RSI ${rsi.toFixed(2)}%\n\n`;
    }
  }

  if (message !== '') {
    bot.sendMessage(telegramChatId, message);
  } else {
    bot.sendMessage(telegramChatId, 'В Багдаде все спокойно...');
  }
}

async function getTopPairs() {
  const exchangeInfo = await client.exchangeInfo();
  const symbols = exchangeInfo.symbols;
  const pairsByVolume = symbols
    .filter(
      (symbol) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
    )
    .map((symbol) => {
      const baseAsset = symbol.baseAsset;
      const quoteAsset = symbol.quoteAsset;
      const volume = symbol.volume;
      return { pair: `${baseAsset}${quoteAsset}`, volume };
    })
    .sort((a, b) => b.volume - a.volume);
  const top50Pairs = pairsByVolume.slice(0, 150).map((pair) => pair.pair);
  return top50Pairs;
}

// setInterval(async () => {
//   pairsToMonitor = await getTop50Pairs();
// }, 1000); // update every hour

(async () => {
  pairsToMonitor = await getTopPairs();
})();

setInterval(checkPriceChanges, 5000);
