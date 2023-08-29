const buySignalKaufman = (ama, filter) => {
  let criterionBuy = false;

  const sliceArr = ama.slice(-4, -1);

  for (let i = 0; i < sliceArr.length - 1; i++) {
    const betweenPeriods = sliceArr.at(-1) - sliceArr.at(i);
    if (betweenPeriods > filter) {
      criterionBuy = true;
    }
  }

  return criterionBuy;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) =>
    buySignalKaufman(coin.kama, coin.filterKama)
  );
  console.log(filteredCoins);

  return filteredCoins.slice(0, 1);
};

export default filterCoins;
