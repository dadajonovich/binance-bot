const getStrCoinsInfo =
  (templateMessageMA = (f) => f, getMessageInfoTemplate = (f) => f) =>
  (coins = []) => {
    try {
      let message = '';
      message += coins
        .map(
          (coin) => `\n${coin.pair}
  - Current Price: ${coin.currentPrice.toFixed(2)}
  - Volatility: ${coin.volatility.toFixed(2)}%
  ${getMessageInfoTemplate(
    'SMA',
    coin.SMA,
    templateMessageMA,
    coin
  )} / ${coin.percentDiffSMA.toFixed(2)}%
  ${getMessageInfoTemplate(
    'EMA',
    coin.EMA,
    templateMessageMA,
    coin
  )} / ${coin.percentDiffEMA.toFixed(2)}%
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
