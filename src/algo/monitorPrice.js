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
  async (coins, { balanceFree: balanceUSDT }) => {
    try {
      coins.forEach(async (coin) => {
        const { pair, currentPrice, volatility, SMA, EMA, MACD, RSI } = coin;

        const match = pair.match(/^(.*)USDT$/);
        const asset = match[1];
        const { balanceFree: balanceAsset } = await getBalance(client, asset);
        const { stepSize, tickSize } = await getLotParams(client, pair);
        console.log(stepSize, tickSize);

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

        const signalCancelForBuy = calculatePercentageDifference(
          priceBuyStore,
          currentPrice
        );
        const signalCancelForSell = calculatePercentageDifference(
          priceSellStore,
          currentPrice
        );

        console.log(signalCancelForBuy);
        console.log(signalCancelForSell);

        const buyOrderExists = openOrders.some(
          (order) => order.side === 'BUY' && order.status === 'NEW'
        );
        const sellOrderExists = openOrders.some(
          (order) => order.side === 'SELL' && order.status === 'NEW'
        );

        if (
          !buyOrderExists &&
          !sellOrderExists &&
          balanceAsset < stepSize &&
          penultimateMACD < 0 &&
          lastMACD > 0
        ) {
          console.log('Buy order');
          const { roundedPriceBuy, quantityBuy } = getValuesForOrder(
            currentPrice,
            stepSize,
            tickSize,
            balanceUSDT,
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

        if (!buyOrderExists && !sellOrderExists && balanceAsset > stepSize) {
          console.log('Sell order!');
          console.log(balanceAsset);
          const { roundedPriceSell, quantitySell } = getValuesForOrder(
            currentPrice,
            stepSize,
            tickSize,
            balanceAsset,
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

        if (signalCancelForBuy > 0.5) {
          cancelOrders(client, openOrders);
        }
      });
    } catch (err) {
      console.error(`Error in monitorPrice`, err);
    }
  };
module.exports = monitorPrice;
