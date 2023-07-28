// const AMA = [15, 50, 100, 110, 115, 120, 90, 100, 130, 150];
// const filterValue = 15;

const buySignalKaufman = ({ kama, filterKama }) => {
  let criterionBuy = false;
  if (kama.at(-2) > kama.at(-3)) {
    criterionBuy = kama.at(-2) - kama.at(-3) > filterKama;
  }

  return criterionBuy;
};

// console.log(longSignalKaufman(AMA, filterValue));

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) => buySignalKaufman(coin));
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
