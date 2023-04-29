const getValueForOrder = (targetPrice, stepSize, balanceFree) => {
  const decimalPlaces = stepSize.indexOf('1') - 1;
  const roundedPrice = (Math.round(targetPrice / stepSize) * stepSize).toFixed(
    decimalPlaces
  );
  const quantity = Math.floor(balanceFree / roundedPrice);
  console.log(stepSize, decimalPlaces, roundedPrice, quantity);
  return { roundedPrice, quantity };
};

module.exports = getValueForOrder;
