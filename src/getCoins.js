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
  getBOP,
} = require('./ta/indexTA');

const {
  templateMessageIndicator,
  templateMessageMA,
  getMessage,
} = require('./message/indexMessage.js');

const getCriterion = require('./getCriterion.js');

const getCoins = async (client, pairs, intervalToMonitor, period) => {
  const coins = await Promise.all(
    pairs.map(async (pair) => {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);

      const criterion = getCriterion(getMACD(prices));

      // if (!criterion) return;

      return {
        pair,
        currentPrice: Number(prices.currentPrice.toFixed(2)),
        SMA: getSMA(prices),
        EMA: getEMA(prices),
        WMA: getWMA(prices),
        WWMA: getVWMA(prices),
        VWAP: getVWAP(prices),
        MACD: getMACD(prices),
        RSI: getRSI(prices),
        BOP: getBOP(prices),
      };
    })
  );
  const filteredCoins = coins.filter((coin) => coin !== undefined);
  return filteredCoins;
};

const getStrCoinsInfo = (coins) => {
  let message = '';
  message += coins
    .map((coin) => {
      return `\n${coin.pair}
      - Текущая цена: ${coin.currentPrice.toFixed(2)}
      ${getMessage('SMA', coin.SMA, templateMessageMA, coin)}
      ${getMessage('EMA', coin.EMA, templateMessageMA, coin)}
      ${getMessage('WMA', coin.WMA, templateMessageMA, coin)}
      ${getMessage('WWMA', coin.WWMA, templateMessageMA, coin)}
      ${getMessage('VWAP', coin.VWAP, templateMessageMA, coin)}
      ${getMessage('MACD', coin.MACD, templateMessageIndicator)}
      ${getMessage('RSI', coin.RSI, templateMessageIndicator)}
      ${getMessage('BOP', coin.BOP, templateMessageIndicator)}
      `;
    })
    .join('');

  return message;
};

module.exports = { getCoins, getStrCoinsInfo };
