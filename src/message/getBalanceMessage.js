const getBalanceMessage = ({ balanceFree, balanceLocked }) => {
  try {
    const message = `- Free balance: ${balanceFree.toFixed(
      2
    )}$\n- Locked balance: ${balanceLocked.toFixed(2)}$`;
    return message;
  } catch (err) {
    console.error(`Error in getBalanceMessage`, err);
    return '';
  }
};

module.exports = getBalanceMessage;
