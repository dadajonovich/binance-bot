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

    const roundedPriceBuy = targetPrice.toFixed(decimalPlacesPrice);

    const roundedPriceSell = (targetPrice * 1.03).toFixed(decimalPlacesPrice);

    const quantity = (Math.floor(balanceFree) / roundedPriceBuy).toFixed(
      decimalPlacesQuantity
    );
    console.log(pair, roundedPriceBuy, roundedPriceSell, quantity);
    return { roundedPriceBuy, roundedPriceSell, quantity };
  } catch (err) {
    console.error(`Error in getValueForOrder:${pair}`, err);
    return {};
  }
};

module.exports = getValuesForOrder;
