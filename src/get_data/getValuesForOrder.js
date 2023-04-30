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

    const roundedPrice = targetPrice.toFixed(decimalPlacesPrice);

    const quantity = (Math.floor(balanceFree) / roundedPrice).toFixed(
      decimalPlacesQuantity
    );
    console.log(pair, stepSize, decimalPlacesQuantity, roundedPrice, quantity);
    return { roundedPrice, quantity };
  } catch (err) {
    console.error(`Error in getValueForOrder:${pair}`, err);
    return {};
  }
};

module.exports = getValuesForOrder;
