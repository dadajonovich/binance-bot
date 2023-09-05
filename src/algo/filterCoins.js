const crossKeltner = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] = coin.kelt.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.kelt.at(-3);

  const crossLowLine =
    // thirdCandle.open < thirdLowerLine && secondCandle.open > secondLowerLine;
    secondCandle.close > secondLowerLine && thirdCandle.close < thirdLowerLine;
  if (crossLowLine) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => crossKeltner(coin) && coin.er.at(-2) < 0.25
  );
  console.log(filteredCoins);

  return filteredCoins.slice(0, 1);
};

export default filterCoins;
