const getBalance = async (client, asset = 'USDT') => {
  try {
    const accountInfo = await client.accountInfo();
    const balance = accountInfo.balances.find((b) => b.asset === asset);
    const balanceFree = parseFloat(balance.free);
    const balanceLocked = parseFloat(balance.locked);
    return { balanceFree, balanceLocked };
  } catch (err) {
    console.error('Error in getBalance:', err);
    return {};
  }
};

module.exports = getBalance;
