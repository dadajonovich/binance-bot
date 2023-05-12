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
            RSI,
            MACDOBV,
            williams,
            upperLine,
            currentPrice,
            signalMACD,
          },
        ] = await curryGetCoins([pair]);
        const firstCriterionSell =
          MACD.at(-1) < signalMACD.at(-1) && RSI.at(-1) < 50;
        const secondCriterionSell =
          williams.at(-1) > -50 &&
          williams.at(-2) < -50 &&
          MACD.at(-1) < signalMACD.at(-1);

        console.log(firstCriterionSell);
        if (firstCriterionSell || secondCriterionSell) {
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
