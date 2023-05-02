const calculatePercentageDifference = (num1, num2) => {
  const parsedNum1 = parseFloat(num1);
  const parsedNum2 = parseFloat(num2);
  const difference = Math.abs(parsedNum1 - parsedNum2);
  const average = (parsedNum1 + parsedNum2) / 2;
  const percentageDifference = (difference / average) * 100;
  return percentageDifference;
};

const monitorPrice =
  (
    client,
    createOrder = (f) => f,
    getBalance = (f) => f,
    getLotParams = (f) => f,
    getValuesForOrder = (f) => f,
    getOpenOrders = (f) => f,
    cancelOrders = (f) => f
  ) =>
  async (coins) => {
    try {
      coins.forEach(async (coin) => {
        const {
          pair,
          currentPrice,
          volatility,
          standartDeviation,
          SMA,
          EMA,
          MACD,
          RSI,
        } = coin;

        const targetPrice = currentPrice - standartDeviation;
        const { [pair]: price } = await client.prices({ symbol: pair });
        const goalPercent = calculatePercentageDifference(targetPrice, price);
        console.log(
          `${pair} - ${goalPercent}%\nprice: ${price}, targetPrice: ${targetPrice}`
        );
        // if (price > targetPrice) return;

        const match = pair.match(/^(.*)USDT$/);
        const asset = match[1];
        const { balanceFree: quantityAsset } = await getBalance(client, asset);
        const { balanceFree: quantityUSDT } = await getBalance(client, 'USDT');
        const { stepSize, tickSize } = await getLotParams(client, pair);

        const lastSMA = SMA.at(-1);
        const lastEMA = EMA.at(-1);
        const penultimateMACD = MACD.at(-2);
        const lastMACD = MACD.at(-1);
        const penultimateRSI = RSI.at(-2);
        const lastRSI = RSI.at(-1);

        console.log(
          `${pair} \nprice: ${currentPrice} \nVolatility: ${volatility.toFixed(
            2
          )}\nSMA: ${lastSMA.toFixed(2)} \nEMA: ${lastEMA.toFixed(
            2
          )} \nMACD: ${penultimateMACD.toFixed(2)} to ${lastMACD.toFixed(
            2
          )} \nRSI: ${penultimateRSI.toFixed(2)} to ${lastRSI.toFixed(2)}`
        );

        let priceBuyStore;
        let priceSellStore;

        const openOrders = await getOpenOrders(client, pair);

        openOrders.forEach((item) => {
          if (item.side === 'SELL') {
            priceSellStore = item.price;
          } else {
            priceBuyStore = item.price;
          }
        });

        const buyOrderExists = openOrders.some(
          (order) => order.side === 'BUY' && order.status === 'NEW'
        );
        const sellOrderExists = openOrders.some(
          (order) => order.side === 'SELL' && order.status === 'NEW'
        );

        const signalCancelBuyOrder = calculatePercentageDifference(
          priceBuyStore,
          price
        );
        const signalCancelSellOrder = calculatePercentageDifference(
          priceSellStore,
          price
        );

        if (
          quantityUSDT > 10 &&
          !buyOrderExists &&
          !sellOrderExists &&
          quantityAsset < stepSize
        ) {
          console.log('Buy order');
          const { roundedPriceBuy, quantityBuy } = getValuesForOrder(
            Number(price),
            stepSize,
            tickSize,
            quantityUSDT,
            pair
          );

          priceBuyStore = roundedPriceBuy;
          await createOrder(
            client,
            pair,
            'BUY',
            'LIMIT',
            quantityBuy,
            roundedPriceBuy
          );
        }

        if (quantityAsset > stepSize) {
          console.log('Sell order!');
          const { roundedPriceSell, quantitySell } = getValuesForOrder(
            Number(price),
            stepSize,
            tickSize,
            quantityAsset,
            pair
          );
          priceSellStore = roundedPriceSell;
          await createOrder(
            client,
            pair,
            'SELL',
            'LIMIT',
            quantitySell,
            roundedPriceSell
          );
        }

        // if (signalCancelBuyOrder > 0.5) {
        //   await cancelOrders(client, openOrders);
        // }
      });
    } catch (err) {
      console.error(`Error in monitorPrice`, err);
    }
  };
module.exports = monitorPrice;
