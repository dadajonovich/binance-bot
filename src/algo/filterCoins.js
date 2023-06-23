const crossUnderFibo = (coin) => {
  // const secondCandle = coin.candles.at(-2);
  // const thirdCandle = coin.candles.at(-3);

  const criterionSMA =
    coin.sma50.at(-2) > coin.sma200.at(-2) &&
    coin.sma50.at(-3) > coin.sma200.at(-3);

  // const criterionRSI = coin.rsi.at(-2) < 45;

  const criterionCross =
    coin.sma3.at(-2) > coin.lineBottom && coin.sma3.at(-3) < coin.lineBottom;

  if (criterionSMA && criterionCross) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 1 && crossUnderFibo(coin)
  );
  console.log(filteredCoins);
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
