const {
  templateMessageIndicator,
  templateMessageMA,
  getMessage,
} = require('./message/indexMessage.js');

const getStrCoinsInfo = (coins) => {
  let message = '';
  message += coins
    .map((coin) => {
      return `\n${coin.pair}
- Текущая цена: ${coin.currentPrice.toFixed(2)}
${getMessage('SMA', coin.SMA, templateMessageMA, coin)}
${getMessage('EMA', coin.EMA, templateMessageMA, coin)}
${getMessage('WMA', coin.WMA, templateMessageMA, coin)}
${getMessage('VWMA', coin.VWMA, templateMessageMA, coin)}
${getMessage('VWAP', coin.VWAP, templateMessageMA, coin)}
${getMessage('Hull', coin.Hull, templateMessageMA, coin)}
${getMessage('LSMA', coin.LSMA, templateMessageMA, coin)}
${getMessage('KAMA', coin.KAMA, templateMessageMA, coin)}
${getMessage('WSMA', coin.WSMA, templateMessageMA, coin)}
${getMessage('HWMA', coin.HWMA, templateMessageMA, coin)}
${getMessage('PWMA', coin.PWMA, templateMessageMA, coin)}
${getMessage('MACD', coin.MACD, templateMessageIndicator)}
${getMessage('RSI', coin.RSI, templateMessageIndicator)}
${getMessage('BOP', coin.BOP, templateMessageIndicator)}
        `;
    })
    .join('');

  return message;
};
module.exports = getStrCoinsInfo;
