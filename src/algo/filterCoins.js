// const AMA = [15, 50, 100, 110, 115, 120, 90, 100, 130, 150];
// const filterValue = 15;

// const buySignalKaufman = ({ kama, filterKama }) => {
//   const criterionBuy =
//     kama.at(-2) - kama.at(-3) > filterKama ||
//     kama.at(-2) - kama.at(-4) > filterKama ||
//     kama.at(-2) - kama.at(-5) > filterKama;
//   return criterionBuy;
// };

const buySignalKaufman = (ama, filter) => {
  let criterionBuy = false;

  const sliceArr = ama.slice(-5, -1);

  for (let i = 0; i < sliceArr.length - 1; i++) {
    const betweenPeriods = sliceArr.at(-1) - sliceArr.at(i);
    if (betweenPeriods > filter) {
      criterionBuy = true;
    }
  }

  return criterionBuy;
};

// console.log(buySignalKaufman(AMA, filterValue));

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

module.exports = filterCoins;
