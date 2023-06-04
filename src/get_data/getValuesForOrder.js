const toFixedHard = (number, x) =>
  parseFloat(number.toFixed(x + 1).slice(0, -1));

const getValuesForOrder = (
  currentPrice,
  stepSize,
  tickSize,
  balanceFree,
  pair
) => {
  try {
    console.log(
      typeof currentPrice,
      typeof stepSize,
      typeof tickSize,
      typeof balanceFree,
      typeof pair
    );
    const decimalPlacesQuantity =
      parseFloat(stepSize) === 1 ? 0 : stepSize.indexOf('1') - 1;

    const decimalPlacesPrice =
      parseFloat(tickSize) === 1 ? 0 : tickSize.indexOf('1') - 1;

    const roundedPrice = toFixedHard(currentPrice, decimalPlacesPrice);

    const quantityBuy = toFixedHard(
      (balanceFree - balanceFree * 0.001) / roundedPrice,
      decimalPlacesQuantity
    );
    const quantitySell = toFixedHard(balanceFree, decimalPlacesQuantity);
    console.log(
      `pair: ${pair}, 
      currentPrice: ${currentPrice}, 
      tickSize: ${tickSize},
      roundedPrice: ${roundedPrice}, 
      stepSize: ${stepSize}, 
      quantityBuy: ${quantityBuy}, 
      quantitySell: ${quantitySell}

      `
    );
    return { roundedPrice, quantityBuy, quantitySell };
  } catch (err) {
    console.error(`Error in getValuesForOrder: ${pair}`, err);
    return {};
  }
};

module.exports = getValuesForOrder;
