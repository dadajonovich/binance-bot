const firstCriterion = (coin) => {
  let crossingIndex = null;
  for (let i = -1; i >= -4; i--) {
    if (
      crossingIndex === null &&
      coin.signalMACD.at(i - 1) > coin.MACD.at(i - 1) &&
      coin.signalMACD.at(i) < coin.MACD.at(i) &&
      coin.MACD.at(i) < 0
    ) {
      crossingIndex = i;
      console.log(`pair - ${coin.pair}, crossingIndex - ${crossingIndex}`);
    }
  }

  if (crossingIndex !== null) {
    if (coin.RSI.at(-1) > 50 && coin.MACD.at(-1) > 0) {
      return true;
    }
  }
  return false;
};

const thirdCriterion = (coin) =>
  coin.percentDiffHULL > 0 &&
  coin.percentDiffKAMA > 0 &&
  coin.percentDiffEMA > 0;

const fourthCriterion = (coin) => {
  let crossingIndex = null;
  for (let i = coin.KAMA.length - 3; i < coin.KAMA.length; i++) {
    if (
      crossingIndex === null &&
      coin.KAMA[i - 1] > coin.closePrices[i - 1] &&
      coin.KAMA[i] < coin.closePrices[i]
    ) {
      console.log(
        `\npair - ${coin.pair}, coin.KAMA.length - 3 - ${
          coin.KAMA.length - 3
        }, coin.closePrices[i] - ${coin.closePrices[i]}`
      );
      crossingIndex = i;
    }
  }

  if (crossingIndex !== null) {
    const crossingValue = coin.KAMA[crossingIndex];
    console.log(
      `crossingIndex - ${crossingIndex}, crossingValue - ${crossingValue}`
    );

    for (let i = crossingIndex + 1; i < coin.KAMA.length; i++) {
      const diff = coin.KAMA[i] - crossingValue;
      console.log(
        `i - ${i}, coin.KAMA[i] -  ${coin.KAMA[i]}, coin.filterKama - ${coin.filterKama}, diff -  ${diff}`
      );

      if (diff > coin.filterKama) {
        return true;
      }
    }
  }
  return false;
};

const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter((coin) => firstCriterion(coin));
  const sortCoins = filteredCoins.sort((a, b) => b.volatility - a.volatility);
  // return filteredCoins;
  return sortCoins.slice(0, 1);
};

module.exports = filterCoins;
