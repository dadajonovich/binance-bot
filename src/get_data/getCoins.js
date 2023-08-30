const getCoins =
  (curryGetCandles = (f) => f, getPrices = (f) => f, getKAMA = (f) => f) =>
  async (pairs = []) => {
    try {
      const coins = await Promise.all(
        pairs.map(async (pair) => {
          let candles;
          await new Promise((resolve) => {
            const checkCandles = async () => {
              candles = await curryGetCandles(pair);
              if (candles.length > 0) {
                resolve();
              } else {
                setTimeout(checkCandles, 0.1 * 60 * 1000);
              }
            };
            checkCandles();
          });
          const prices = getPrices(candles);
          const { closePrices } = prices;
          const { kama, filterKama } = getKAMA(closePrices, 10, 5, 30);

          return {
            pair,
            kama,
            filterKama,
          };
        })
      );
      return coins;
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

export default getCoins;
