const getStrCoinsInfo =
  (
    templateMessageIndicator = (f) => f,
    templateMessageMA = (f) => f,
    getMessageInfoTemplate = (f) => f
  ) =>
  (coins = []) => {
    try {
      let message = '';
      message += coins
        .map(
          (coin) => `\n${coin.pair}
  - Current Price: ${coin.currentPrice.toFixed(2)}
  - Volatility: ${coin.volatility.toFixed(2)}%
  - VWAP: ${coin.VWAP.at(-1).toFixed(2)} / ${coin.percentDiffVWAP.toFixed(2)}%
  - EMA200: ${coin.EMA200.at(-1).toFixed(2)} / ${coin.percentDiffEMA200.toFixed(
            2
          )}%
  ${getMessageInfoTemplate(
    'EMA8',
    coin.EMA8,
    templateMessageMA,
    coin
  )} / ${coin.percentDiffEMA8.toFixed(2)}%
  ${getMessageInfoTemplate(
    'EMA21',
    coin.EMA21,
    templateMessageMA,
    coin
  )} / ${coin.percentDiffEMA21.toFixed(2)}%
  ${getMessageInfoTemplate(
    'EMA50',
    coin.EMA50,
    templateMessageMA,
    coin
  )} / ${coin.percentDiffEMA50.toFixed(2)}%
  ${getMessageInfoTemplate(
    'HULL',
    coin.HULL,
    templateMessageMA,
    coin
  )} / ${coin.percentDiffHULL.toFixed(2)}%
  ${getMessageInfoTemplate('MACD', coin.MACD, templateMessageIndicator)}
  ${getMessageInfoTemplate('RSI', coin.RSI, templateMessageIndicator)}
  ${getMessageInfoTemplate('OBV', coin.OBV, templateMessageIndicator)}
          `
        )
        .join('');

      return message;
    } catch (err) {
      console.error('Error in getStrCoinsInfo', err);
      return '';
    }
  };
module.exports = getStrCoinsInfo;
