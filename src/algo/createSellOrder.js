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
            EMA9,
            EMA20,
            EMA50,
            percentDiffEMA8,
            OBV,
            MACD,
            signalMACD,
            RSI,
            VWAP,
            envelope,
          },
        ] = await curryGetCoins([pair]);
        const { [pair]: price } = await client.prices({ symbol: pair });

        if (takeProfit === null) {
          takeProfit = price * (1 + 3 / 100);
        }

        if (stopLoss === null) {
          stopLoss = price - price * 0.015;
        }
        const [secondUpperLine, secondMiddleLine, secondLowerLine] =
          envelope.at(-2);

        const firstCriterionSell =
          secondMiddleLine < candles.at(-2).close ||
          stopLoss > candles.at(-2).close;
        console.log(
          `takeProfit - ${takeProfit}, secondMiddleLine - ${secondMiddleLine}, candles close - ${
            candles.at(-2).close
          }`
        );

        // const firstCriterionSell =
        //   takeProfit < price || EMA20.at(-2) > candles.at(-2).close;
        // console.log(
        //   `takeProfit - ${takeProfit}, EMA20 - ${EMA20.at(
        //     -2
        //   )}, candles close - ${candles.at(-2).close}`
        // );

        // console.log(firstCriterionSell);
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
