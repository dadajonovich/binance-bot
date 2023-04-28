const getStrCoinsInfo =
  (
    templateMessageIndicator = (f) => f,
    templateMessageMA = (f) => f,
    getMessageInfoTemplate = (f) => f
  ) =>
  (coins = []) => {
    let message = '';
    message += coins
      .map(
        (coin) => `\n${coin.pair}
- Current Price: ${coin.currentPrice.toFixed(2)}
- Volatility: ${coin.volatility.toFixed(0)}%
${getMessageInfoTemplate('SMA', coin.SMA, templateMessageMA, coin)}
${getMessageInfoTemplate('EMA', coin.EMA, templateMessageMA, coin)}
${getMessageInfoTemplate('MACD', coin.MACD, templateMessageIndicator)}
${getMessageInfoTemplate('RSI', coin.RSI, templateMessageIndicator)}
        `
      )
      .join('');

    return message;
  };
module.exports = getStrCoinsInfo;
