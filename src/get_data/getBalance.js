async function getBalance(asset, client) {
  try {
    const accountInfo = await client.accountInfo();
    console.log(accountInfo);
    const balance = accountInfo.balances.find((b) => b.asset === asset);
    return parseFloat(balance.free) + parseFloat(balance.locked);
  } catch (err) {
    console.error('Ошибка в запросе баланса:', err);
  }
}

// Пример использования функции для получения баланса BTC
// (async () => {
//   const balance = await getBalance('BTC');
//   console.log(`Your BTC balance is: ${balance}`);
// })();

module.exports = getBalance;
