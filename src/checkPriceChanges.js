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

const checkPriceChanges = async (client, pairs, intervalToMonitor, period) => {
  const messages = await Promise.all(
    pairs.map(async (pair) => {
      const candles = await getCandles(client, pair, intervalToMonitor, period);
      const prices = getPrices(candles);

      const criterion = getCriterion(getMACD(prices));

      if (!criterion) return;

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
};

module.exports = checkPriceChanges;
