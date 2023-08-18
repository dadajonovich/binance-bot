const buySignalKaufman = (ama, filter) => {
  let criterionBuy = false;
  const betweenPeriods = ama.at(-2) - ama.at(-3);

  if (betweenPeriods > filter) {
    criterionBuy = true;
  }

  return criterionBuy;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) =>
    buySignalKaufman(coin.kama, coin.filterKama)
  );
  const sortCoins = filteredCoins.sort(
    (a, b) => a.volatility.at(-2) - b.volatility.at(-2)
  );
  console.log(sortCoins);
  return sortCoins.slice(0, 1);
};

export default filterCoins;
