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
  - Standart deviation: ${coin.standartDeviation.toFixed(4)}
  - OBV: ${coin.OBV.at(-1).toFixed(2)}
  ${getMessageInfoTemplate('SMA', coin.SMA, templateMessageMA, coin)}
  ${getMessageInfoTemplate('EMA', coin.EMA, templateMessageMA, coin)}
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
