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

    await new Promise((resolve) => {
      const checkSellInterval = setInterval(async () => {
        console.log('tick checkSellInterval...');
        const [
          {
            MACD,
            OBV,
            EMA,
            RSI,
            MACDOBV,
            williams,
            upperLine,
            currentPrice,
            signalMACD,
            KAMA,
            HULL,
          },
        ] = await curryGetCoins([pair]);

        const { [pair]: price } = await client.prices({ symbol: pair });
        const firstCriterionSell = HULL.at(-1) > price;
        const secondCriterionSell = currentPrice < EMA.at(-1);

        console.log(firstCriterionSell);
        console.log(HULL.at(-1), price);
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
