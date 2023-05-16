const firstCriterion = (coin) =>
  coin.volatility > 0.5 &&
  coin.MACD.at(-1) > 0 &&
  coin.MACD.at(-2) < 0 &&
  coin.MACD.at(-2) > coin.signalMACD.at(-2) &&
  coin.MACD.at(-3) < coin.signalMACD.at(-3) &&
  coin.RSI.at(-1) > 50;

// const secondCriterion = (coin) =>
//   coin.volatility > 0.25 &&
//   coin.MACD.at(-1) > coin.signalMACD.at(-1) &&
//   coin.currentPrice < coin.goalFIB;

const thirdCriterion = (coin) =>
  coin.percentDiffHULL > 0 &&
  coin.percentDiffKAMA > 0 &&
  coin.percentDiffEMA > 0;

const secondCriterion = (coin) =>
  coin.KAMA.at(-3) > coin.currentPrice &&
  coin.KAMA.at(-2) < coin.currentPrice &&
  coin.KAMA.at(-1) < coin.currentPrice &&
  coin.KAMA.at(-1) - coin.KAMA.at(-2) > coin.filterKama;

const fourthCriterion = (coin) => {
  let crossingIndex = null;
  for (let i = coin.KAMA.length - 5; i < coin.KAMA.length; i++) {
    if (
      crossingIndex === null &&
      coin.KAMA[i - 1] > coin.closePrices[i - 1] &&
      coin.KAMA[i] < coin.closePrices[i]
    ) {
      console.log(coin.closePrices[i]);
      crossingIndex = i;
    }
  }

  if (crossingIndex !== null) {
    const crossingValue = coin.KAMA[crossingIndex];
    console.log(crossingIndex, crossingValue);

    for (let i = crossingIndex + 1; i < coin.KAMA.length; i++) {
      const diff = coin.KAMA[i] - crossingValue;
      console.log(i, coin.KAMA[i], diff);
      console.log(coin.filterKama);

      if (diff > coin.filterKama) {
        return true;
      }
    }
  }
  return false;
};

const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter((coin) => fourthCriterion(coin));
  const sortCoins = filteredCoins.sort(
    (a, b) => b.percentDiffKAMA - a.percentDiffKAMA
  );
  // return filteredCoins;
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
