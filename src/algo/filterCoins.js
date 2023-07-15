const filter = (coin) => {
  const secondCandle = coin.candles.at(-2);
  const thirdCandle = coin.candles.at(-3);

  const criterionSMA =
    secondCandle.close > coin.sma200.at(-2) &&
    thirdCandle.close > coin.sma200.at(-3);

  const criterionVol = coin.volOsc.at(-2) > 0 && coin.volOsc.at(-3) > 0;

  const criterionMACD = coin.macd.at(-2) < 0;

  const crossMacd =
    coin.macd.at(-2) > coin.signalMacd.at(-2) &&
    coin.macd.at(-3) < coin.signalMacd.at(-3);

  if (criterionSMA && criterionVol && criterionMACD && crossMacd) {
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
