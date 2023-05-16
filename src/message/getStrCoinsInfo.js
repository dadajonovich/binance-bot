const getStrCoinsInfo =
  (
    templateMessageIndicator = (f) => f,
    templateMessageMA = (f) => f,
    getMessageInfoTemplate = (f) => f,
    templateMessageBollinger = (f) => f
  ) =>
  (coins = []) => {
    try {
      let message = '';
      message += coins
        .map(
          (coin) => `\n${coin.pair}
  - Current Price: ${coin.currentPrice.toFixed(2)}
  - Volatility: ${coin.volatility.toFixed(2)}%
  ${getMessageInfoTemplate('SMA', coin.SMA, templateMessageMA, coin)}
  ${getMessageInfoTemplate('EMA', coin.EMA, templateMessageMA, coin)}
  ${getMessageInfoTemplate('VWMA', coin.VWMA, templateMessageMA, coin)}
  ${getMessageInfoTemplate('Kaufman', coin.KAMA, templateMessageMA, coin)}
  ${getMessageInfoTemplate('Hull', coin.HULL, templateMessageMA, coin)}
  ${getMessageInfoTemplate('MACD', coin.MACD, templateMessageIndicator)}
  ${getMessageInfoTemplate('MACD OBV', coin.MACDOBV, templateMessageIndicator)}
  ${getMessageInfoTemplate('RSI', coin.RSI, templateMessageIndicator)}
  ${getMessageInfoTemplate('OBV', coin.OBV, templateMessageIndicator)}
  ${getMessageInfoTemplate(
    'Williams %R',
    coin.williams,
    templateMessageIndicator
  )}
  ${getMessageInfoTemplate('Bollinger', coin.BOLL, templateMessageBollinger)}
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
