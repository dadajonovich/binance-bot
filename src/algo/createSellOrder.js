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
    let takeProfit = null;
    let stopLoss = null;

    await new Promise((resolve) => {
      const checkSellInterval = setInterval(async () => {
        console.log('tick checkSellInterval...');
        const [
          { candles, EMA8, percentDiffEMA8, HULL, OBV, MACD, signalMACD, RSI },
        ] = await curryGetCoins([pair]);
        const { [pair]: price } = await client.prices({ symbol: pair });

        if (takeProfit === null) {
          takeProfit = price * (1 + percentDiffEMA8 / 100);
        }

        if (stopLoss === null) {
          stopLoss = price * (1 - percentDiffEMA8 / 3 / 100);
        }

        const firstCriterionSell =
          EMA8.at(-1) > price || takeProfit < price || stopLoss > price;

        console.log(
          `EMA8 - ${EMA8.at(
            -1
          )}, \nprice - ${price}, \ntakeProfit -${takeProfit}, \nstopLoss - ${stopLoss}}`
        );

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
