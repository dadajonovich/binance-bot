const crossEnvelope = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [firstUpperLine, firstMiddleLine, firstLowerLine] =
    coin.envelope.at(-1);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.envelope.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] =
    coin.envelope.at(-3);

  const crossLowLine =
    // thirdCandle.open < thirdLowerLine && secondCandle.open > secondLowerLine;
    secondCandle.open < secondLowerLine && firstCandle.open > firstLowerLine;
  if (crossLowLine) {
    return true;
  }
  return false;
};

const crossKeltner = (coin) => {
  const firstCandle = coin.candles.at(-1);
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);
  const [firstUpperLine, firstMiddleLine, firstLowerLine] = coin.keltner.at(-1);
  const [secondUpperLine, secondMiddleLine, secondLowerLine] =
    coin.keltner.at(-2);
  const [thirdUpperLine, thirdMiddleLine, thirdLowerLine] = coin.keltner.at(-3);

  const crossLowLine =
    // thirdCandle.open < thirdLowerLine && secondCandle.open > secondLowerLine;
    secondCandle.open < secondLowerLine && firstCandle.open > firstLowerLine;
  if (crossLowLine) {
    return true;
  }
  return false;
};

const filterCoins = (coins) => {
  const filteredCoins = coins.filter(
    (coin) => coin.volatility > 2 && crossKeltner(coin)
  );
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffEMA - a.percentDiffEMA
  );
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
