const {
  templateMessageIndicator,
  templateMessageMA,
  getMessage,
} = require('../message/indexMessage');

const getStrCoinsInfo = (coins) => {
  let message = '';
  message += coins
    .map(
      (coin) => `\n${coin.pair}
- Current Price: ${coin.currentPrice.toFixed(2)}
- Standard Deviation: ${coin.volatility.toFixed(2)}%
${getMessage('SMA', coin.SMA, templateMessageMA, coin)}
${getMessage('EMA', coin.EMA, templateMessageMA, coin)}
${getMessage('MACD', coin.MACD, templateMessageIndicator)}
${getMessage('RSI', coin.RSI, templateMessageIndicator)}
        `
    )
    .join('');

  return message;
};
module.exports = getStrCoinsInfo;
