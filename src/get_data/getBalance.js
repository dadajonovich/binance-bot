const getBalance = async (client, asset = '') => {
  try {
    const accountInfo = await client.accountInfo({ recvWindow: 30000 });
    if (asset === '') {
      const balances = accountInfo.balances
        .filter((b) => {
          const balanceFree = parseFloat(b.free);
          const balanceLocked = parseFloat(b.locked);
          return balanceFree + balanceLocked > 0;
        })
        .map((b) => {
          const balanceFree = parseFloat(b.free);
          const balanceLocked = parseFloat(b.locked);
          return { asset: b.asset, balanceFree, balanceLocked };
        });
      return balances;
    }
    const balance = accountInfo.balances.find((b) => b.asset === asset);
    if (!balance) {
      throw new Error(`No balance found for asset: ${asset}`);
    }
    const balanceFree = parseFloat(balance.free);
    const balanceLocked = parseFloat(balance.locked);
    return { asset, balanceFree, balanceLocked };
  } catch (err) {
    console.error('Error in getBalance:', err);
    return [];
  }
};

export default getBalance;
