const crossKeltner = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const criterionSMA =
    coin.sma50.at(-2) > coin.sma200.at(-2) &&
    coin.sma50.at(-3) > coin.sma200.at(-3) &&
    secondMiddleLine > coin.sma50.at(-2) &&
    thirdMiddleLine > coin.sma50.at(-3);

  const crossLowLine =
    // thirdCandle.open < thirdLowerLine && secondCandle.open > secondLowerLine;
    secondCandle.close > secondLowerLine && thirdCandle.close < thirdLowerLine;
  if (crossLowLine && criterionSMA) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 1 && crossKeltner(coin)
  );
  console.log(filteredCoins);
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
