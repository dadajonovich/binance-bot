const firstCriterion = (coin) =>
  coin.percentBandwidth > 1 &&
  coin.MACD.at(-1) > 0 &&
  coin.MACD.at(-2) < 0 &&
  coin.williams.at(-1) < -50 &&
  coin.currentPrice < coin.middleLine;

const secondCriterion = (coin) =>
  coin.percentBandwidth > 2 &&
  coin.currentPrice > coin.middleLine &&
  coin.penultimateCurrentPrice < coin.middleLine &&
  coin.MACD.at(-1) > coin.MACD.at(-2) &&
  coin.williams.at(-1) < -50;

const thirdCriterion = (coin) =>
  coin.williams.at(-1) > -80 &&
  coin.williams.at(-2) < -80 &&
  coin.MACD.at(-1) > coin.MACD.at(-2) &&
  coin.percentBandwidth > 2;

const fourthCriterion = (coin) =>
  coin.percentBandwidth > 1 &&
  coin.MACDOBV.at(-1) > 0 &&
  coin.MACDOBV.at(-2) < 0 &&
  coin.MACD.at(-1) > coin.MACD.at(-2) &&
  coin.williams.at(-1) < -50 &&
  coin.currentPrice < coin.middleLine;

const filterCoins = (coins, percentageDiffernce) => {
  const filteredCoins = coins.filter(
    (coin) =>
      firstCriterion(coin) ||
      fourthCriterion(coin) ||
      secondCriterion(coin) ||
      thirdCriterion(coin)
  );
  // const sortCoins = filteredCoins.sort((a, b) => b.EMA.at(-1) - a.EMA.at(-1));
  return filteredCoins.slice(0, 1);
};

module.exports = filterCoins;
