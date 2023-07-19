const filter = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const criterionMA =
    secondCandle.close > coin.ma200.at(-2) &&
    thirdCandle.close > coin.ma200.at(-3);

  // const breakdownParabolic =
  //   thirdLowerLine < coin.parabolic.at(-3) &&
  //   secondLowerLine > coin.parabolic.at(-2);

  // const criterionVol = coin.macdVol.at(-2) > coin.lineSignalVol.at(-2);

  // const criterionRSI = coin.rsi.at(-2) > 55;

  // const criterionMOM = coin.mom.at(-2) > 0;

  const criterionMACD = coin.macd.at(-2) < 0;

  const crossMacd =
    coin.macd.at(-2) > coin.lineSignal.at(-2) &&
    coin.macd.at(-3) < coin.lineSignal.at(-3);

  // const crossMacd = coin.macd.at(-2) > 0 && coin.macd.at(-3) < 0;

  if (criterionMACD && crossMacd && criterionMA) {
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
