const crossUnderFibo = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const criterionSMA =
    secondCandle.low > coin.sma200.at(-2) &&
    thirdCandle.low > coin.sma200.at(-3);

  const trend = coin.trend;

  const criterionCross =
    secondCandle.close > coin.lineBottom && thirdCandle.close < coin.lineBottom;

  if (trend && criterionCross) {
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
