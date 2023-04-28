const getBalanceMessage = ({ balanceFree, balanceLocked }) =>
  `- Free balance: ${balanceFree.toFixed(
    2
  )}$\n- Locked balance: ${balanceLocked.toFixed(2)}$`;

module.exports = getBalanceMessage;
