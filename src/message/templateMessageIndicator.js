const templateMessageIndicator = (MA, arr) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('Массив меньше двух элементов');
  }
  const y = arr[len - 2];
  const x = arr[len - 1];

  let statusIndicators;
  x > y ? (statusIndicators = '📈') : (statusIndicators = '📉');
  return `${statusIndicators}${MA} ${y.toFixed(2)} to ${x.toFixed(2)}`;
};

module.exports = templateMessageIndicator;
