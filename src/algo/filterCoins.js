const filter = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const criterionSMA =
    secondLowerLine > coin.sma200.at(-2) && thirdLowerLine > coin.sma200.at(-3);

  const crossSMA =
    thirdUpperLine > thirdCandle.close && secondUpperLine < secondCandle.close;

  if (criterionSMA && crossSMA) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 1 && filter(coin)
  );
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
