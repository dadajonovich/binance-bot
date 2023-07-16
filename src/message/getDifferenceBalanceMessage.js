const ta = require('ta.js');

const getDifferenceBalanceMessage = (prevBalance, currentBalance) => {
  const diffBalance = ta.dif(currentBalance, prevBalance) * 100;

  let status;
  if (prevBalance < currentBalance) {
    status = '📈';
  } else {
    status = '📉';
  }
  return `${status}The balance has changed to ${diffBalance.toFixed(2)}%`;
};

module.exports = getDifferenceBalanceMessage;
