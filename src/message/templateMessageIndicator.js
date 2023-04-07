const templateMessageIndicator = (MA, arr) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('Массив меньше двух элементов');
  }
  const y = arr[len - 2];
  const x = arr[len - 1];

  const percentDifference = ((Math.abs(x) - Math.abs(y)) / Math.abs(y)) * 100;

  let statusIndicators;
  x > y ? (statusIndicators = '📈') : (statusIndicators = '📉');
  return `${statusIndicators}${MA} ${y.toFixed(2)} to ${x.toFixed(
    2
  )} / ${percentDifference.toFixed(2)}%`;
};

module.exports = templateMessageIndicator;
