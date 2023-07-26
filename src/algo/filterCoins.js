// const AMA = [15, 50, 100, 110, 115, 120, 90, 100, 130, 150];
// const filterValue = 15;

const longSignalKaufman = (ama, filter) => {
  let criterionLong = false;

  const sliceArr = ama.slice(-4);
  const maxKAMA = Math.max(...sliceArr);
  const minKAMA = Math.min(...sliceArr);
  const indexMax = sliceArr.indexOf(maxKAMA);
  const indexMin = sliceArr.indexOf(minKAMA);

  if (indexMax > indexMin) {
    criterionLong = ama.at(-2) - minKAMA > filter;
  }
  return criterionLong;
};

// console.log(longSignalKaufman(AMA, filterValue));

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) =>
      coin.volatility > 1 && longSignalKaufman(coin.kama, coin.filterKama)
  );
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
