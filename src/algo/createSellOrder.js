const createSellOrder = async (
  client,
  pair,
  stepSize,
  tickSize,
  quantityAsset,
  curryGetCoins = (f) => f,
  getValuesForOrder = (f) => f,
  createOrder = (f) => f
) => {
  try {
    console.log('Sell order!');

    let isSellOrder = false;
    let targetPrice = null;

    await new Promise((resolve) => {
      const checkSellInterval = setInterval(async () => {
        console.log('tick checkSellInterval...');
        const [
          {
            candles,
            SMA,
            sma9,
            EMA,
            percentDiffSMA,
            percentDiffEMA,
            HULL,
            OBV,
            MACD,
            signalMACD,
            RSI,
            MOM,
          },
        ] = await curryGetCoins([pair]);
        const { [pair]: price } = await client.prices({ symbol: pair });

        if (targetPrice === null) {
          targetPrice = price * (1 + (percentDiffEMA * 0.5) / 100);
        }
        const firstCriterionSell = sma9.at(-1) > price;
        console.log(sma9.at(-1), price);

        console.log(firstCriterionSell);
        if (firstCriterionSell) {
          isSellOrder = true;
          clearInterval(checkSellInterval);
          resolve();
        }
      }, 0.5 * 60 * 1000);
    });

    if (!isSellOrder) throw new Error(`isSellOrder - ${isSellOrder}`);

    const { [pair]: price } = await client.prices({ symbol: pair });

    const { roundedPriceSell, quantitySell } = getValuesForOrder(
      Number(price),
      stepSize,
      tickSize,
      quantityAsset,
      pair
    );
    await createOrder(
      client,
      pair,
      'SELL',
      'MARKET',
      quantitySell
      // roundedPriceSell
    );

    return isSellOrder;
  } catch (err) {
    console.error(`Error in createSellOrder`, err);
    return false;
  }
};

module.exports = createSellOrder;
