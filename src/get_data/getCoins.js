const getCoins =
  (
    curryGetCandles = (f) => f,
    getPrices = (f) => f,
    getKAMA = (f) => f,
    getATR = (f) => f,
    getFilter = (f) => f,
  ) =>
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
          const { closePrices, highPrice, lowPrice } = prices;
          const kama = getKAMA(closePrices, 10, 2, 30);
          const atr = getATR(closePrices, highPrice, lowPrice, 10);
          const filterKAMA = getFilter(kama);
          const filterATR = getFilter(atr);

          return {
            pair,
            kama,
            atr,
            filterKAMA,
            filterATR,
          };
        }),
      );
      // console.log(coins[0]);
      return coins;
    } catch (err) {
      console.error('Error in getting coins', err);
      return [];
    }
  };

export default getCoins;
