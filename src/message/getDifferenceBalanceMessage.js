const getDifferenceBalanceMessage = (prevBalance, currentBalance) => {
  const dif = (n, o) => (n - o) / o;
  const diffBalance = dif(currentBalance, prevBalance) * 100;

  let status;
  if (prevBalance < currentBalance) {
    status = '📈';
  } else {
    status = '📉';
  }
  return `${status}The balance has changed to ${diffBalance.toFixed(2)}%`;
};

export default getDifferenceBalanceMessage;
