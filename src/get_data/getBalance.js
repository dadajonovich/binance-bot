const getBalance = async (client, asset = 'USDT') => {
  try {
    const accountInfo = await client.accountInfo();
    const balance = accountInfo.balances.find((b) => b.asset === asset);
    const balanceFree = parseFloat(balance.free);
    // const balanceLocked = parseFloat(balance.locked);
    console.log(balanceFree);
    return balanceFree;
  } catch (err) {
    console.error('Error in balance request:', err);
    return '';
  }
};

module.exports = getBalance;
