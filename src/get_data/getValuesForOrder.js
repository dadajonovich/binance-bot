// const toFixedHard = (number, x) => {
//   const s = String(number);
//   const [a, b = ''] = s.split('.');
//   return parseFloat(`${a}.${b.substring(0, x)}`);
// };

const toFixedHard = (number, x) => Math.floor(number * 10 ** x) / 10 ** x;
const decimalPlace = (size) => size.toString().split('.')[1]?.length || 0;

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
    const decimalPlacesQuantity = decimalPlace(stepSize);

    const decimalPlacesPrice = decimalPlace(tickSize);

    const roundedPrice = toFixedHard(currentPrice, decimalPlacesPrice);

    const quantityBuy = toFixedHard(
      balanceFree / roundedPrice,
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
