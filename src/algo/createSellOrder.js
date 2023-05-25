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
    let takeProfitVWAP = null;

    await new Promise((resolve) => {
      const checkSellInterval = setInterval(async () => {
        console.log('tick checkSellInterval...');
        const [
          {
            candles,
            EMA8,
            EMA21,
            percentDiffEMA8,
            HULL,
            OBV,
            MACD,
            signalMACD,
            RSI,
            VWAP,
          },
        ] = await curryGetCoins([pair]);
        const { [pair]: price } = await client.prices({ symbol: pair });

        if (takeProfit === null) {
          takeProfit = price * (1 + 1.5 / 100);
        }

        if (stopLoss === null) {
          stopLoss = price * (1 - percentDiffEMA8 / 3 / 100);
        }

        const firstCriterionSell =
          takeProfit < price || EMA21.at(-2) > candles.at(-2).close;
        console.log(
          `takeProfit - ${takeProfit}, EMA21 - ${EMA21.at(
            -2
          )}, candles close - ${candles.at(-2).close}`
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
