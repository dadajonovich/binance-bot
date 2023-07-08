const breakdown = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  // const [secondUpperLine, secondMiddleLine, secondLowerLine] =
  //   coin.keltner.at(-2);
  // const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.envelope.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
    coin.envelope.at(-3);

  // const criterionSMA =
  //   coin.sma50.at(-2) > coin.sma200.at(-2) &&
  //   coin.sma50.at(-3) > coin.sma200.at(-3);

  const crossLowLine =
    coin.parabolic.at(-2) < secondLowerLine &&
    coin.parabolic.at(-3) > thirdLowerLine;
  if (crossLowLine) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 1 && breakdown(coin)
  );
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
