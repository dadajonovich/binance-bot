const getTrackedCoin =
  (client, getLotParams = (f) => f) =>
  async (coin) => {
    try {
      console.log(coin);
      const { stepSize, tickSize } = await getLotParams(client, coin.pair);

      return {
        pair: coin.pair,
        currentPrice: coin.currentPrice,
        stepSize,
        tickSize,
      };
    } catch (err) {
      console.error('Error in getTrackedCoins:', err);
      return {};
    }
  };

module.exports = getTrackedCoin;
