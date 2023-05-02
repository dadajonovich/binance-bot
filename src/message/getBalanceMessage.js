const getBalanceMessage = (coins = []) => {
  let message = '';
  message += coins
    .map(
      (coin) => `\nCoin: ${coin.asset}
- Free balance: ${coin.balanceFree}
- Locked balance: ${coin.balanceLocked}
  `
    )
    .join('');
  return message;
};

module.exports = getBalanceMessage;
