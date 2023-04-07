const templateMessageMA = (MA, arr, { currentPrice }) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('Массив меньше двух элементов');
  }

  const y = arr[len - 2];
  const x = arr[len - 1];

  let statusMA;
  const percentDifference = ((x - currentPrice) / currentPrice) * 100;

  if (x > currentPrice) {
    statusMA = '🔴';
  } else statusMA = '🟢';

  return `${statusMA}${MA} ${y.toFixed(2)} to ${x.toFixed(
    2
  )} / ${percentDifference.toFixed(2)}%`;
};

module.exports = templateMessageMA;
