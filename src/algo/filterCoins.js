const breakdown = (coin) => {
  // const secondCandle = coin.candles.at(-2);
  // const thirdCandle = coin.candles.at(-3);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const [secondKline, secondDline] = coin.stoch.at(-2);
  // const [thirdKline, thirdDline] = coin.stoch.at(-3);

  const criterionStoch = secondKline > 75;

  // const [secondUpperLine, secondMiddleLine, secondLowerLine] =
  //   coin.envelope.at(-2);
  // const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
  //   coin.envelope.at(-3);

  // const criterionSMA =
  //   secondLowerLine > coin.sma200.at(-2) && thirdLowerLine > coin.sma200.at(-3);

  // const criterionMACD = coin.macd.at(-2) < 0 && coin.macd.at(-3) < 0;

  // const crossMacd =
  //   coin.macd.at(-2) > coin.signalMacd.at(-2) &&
  //   coin.macd.at(-3) < coin.signalMacd.at(-3);
  const crossLowLine =
    coin.parabolic.at(-2) < secondLowerLine &&
    coin.parabolic.at(-3) > thirdLowerLine;

  if (crossLowLine && criterionStoch) {
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
