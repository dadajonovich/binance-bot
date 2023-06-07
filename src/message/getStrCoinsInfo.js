const getStrCoinsInfo = (coins = []) => {
  try {
    let message = '';
    message += coins
      .map(
        (coin) => `\n${coin.pair}
  - Current Price: ${coin.currentPrice.toFixed(2)}
  - Volatility: ${coin.volatility.toFixed(2)}%
  - RSI: ${coin.rsi.at(-2).toFixed(2)}
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
