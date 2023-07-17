const filter = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const criterionSMA =
    secondCandle.close > coin.sma200.at(-2) &&
    thirdCandle.close > coin.sma200.at(-3);

  const criterionMACD =
    coin.macd.at(-3) > coin.signalMacd.at(-3) && coin.macd.at(-3) < 0;

  const breakdownUpperLine =
    thirdUpperLine > coin.lineSignal.at(-3) &&
    secondUpperLine < coin.lineSignal.at(-2);

  // const breakdownParabolic =
  //   thirdLowerLine < coin.parabolic.at(-3) &&
  //   secondLowerLine > coin.parabolic.at(-2);

  // const crossMacd =
  //   coin.macd.at(-2) > coin.signalMacd.at(-2) &&
  //   coin.macd.at(-3) < coin.signalMacd.at(-3);

  if (criterionMACD && breakdownUpperLine && criterionSMA) {
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
