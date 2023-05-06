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
        const [{ MACD, OBV }] = await curryGetCoins([pair]);
        console.log(MACD, OBV);
        const criterionSell =
          MACD.at(-1) < MACD.at(-2) && OBV.at(-1) < OBV.at(-2);

        if (criterionSell) {
          isSellOrder = true;
          clearInterval(checkSellInterval);
          resolve();
        }
      }, 15 * 1000);
    });

    if (!isSellOrder) return;

    const { [pair]: price } = await client.prices({ symbol: pair });
    console.log(
      `${Number(price)}, ${stepSize}, ${tickSize}, ${quantityAsset}, ${pair}`
    );
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
      quantitySell,
      roundedPriceSell
    );
  } catch (err) {
    console.error(`Error in createSellOrder`, err);
  }
};

module.exports = createSellOrder;
