const toFixedHard = (number, x) =>
  parseFloat(number.toFixed(x + 1).slice(0, -1));

const getValuesForOrder = (
  targetPrice,
  stepSize,
  tickSize,
  balanceFree,
  pair
) => {
  try {
    const decimalPlacesQuantity =
      parseFloat(stepSize) === 1 ? 0 : stepSize.indexOf('1') - 1;

    const decimalPlacesPrice =
      parseFloat(tickSize) === 1 ? 0 : tickSize.indexOf('1') - 1;

    const roundedPriceBuy = toFixedHard(
      targetPrice - targetPrice * 0.025,
      decimalPlacesPrice
    );

    const roundedPriceSell = toFixedHard(
      targetPrice * 1.0025,
      decimalPlacesPrice
    );

    const quantityBuy = toFixedHard(
      balanceFree / roundedPriceBuy,
      decimalPlacesQuantity
    );
    const quantitySell = toFixedHard(balanceFree, decimalPlacesQuantity);
    console.log(
      `pair: ${pair}, 
      targetPrice: ${targetPrice}, 
      tickSize: ${tickSize},
      roundedPriceBuy: ${roundedPriceBuy}, 
      roundedPriceSell: ${roundedPriceSell}, 
      stepSize: ${stepSize}, 
      quantityBuy: ${quantityBuy}, 
      quantitySell: ${quantitySell}

      `
    );
    return { roundedPriceBuy, roundedPriceSell, quantityBuy, quantitySell };
  } catch (err) {
    console.error(`Error in getValueForOrder:${pair}`, err);
    return {};
  }
};

module.exports = getValuesForOrder;
