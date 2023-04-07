const templateMessageBollinger = (MA, arr, { currentPrice }) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('Массив меньше двух элементов');
  }
  const [lastUpper, lastMiddle, lastLower] = arr[arr.length - 1];

  const [penultimateUpper, penultimateMiddle, penultimateLower] =
    arr[arr.length - 2];

  const percentDifference = (value, currentPrice) =>
    ((value - currentPrice) / currentPrice) * 100;

  const percentDifferencePriceLast = [lastUpper, lastMiddle, lastLower].map(
    (price) => percentDifference(price, currentPrice)
  );

  const [lastUpperPercent, lastMiddlePercent, lastLowerPercent] =
    percentDifferencePriceLast;

  let statusIndicators;
  lastMiddle > penultimateMiddle
    ? (statusIndicators = '📈')
    : (statusIndicators = '📉');

  return `${statusIndicators}${MA} U${lastUpper.toFixed(
    2
  )}(${lastUpperPercent.toFixed(2)}%) / M${lastMiddle.toFixed(
    2
  )}(${lastMiddlePercent.toFixed(2)}%) / L${lastLower.toFixed(
    2
  )}(${lastLowerPercent.toFixed(2)}%)`;
};

module.exports = templateMessageBollinger;
