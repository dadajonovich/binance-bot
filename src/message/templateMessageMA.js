const templateMessageMA = (MA, arr, { currentPrice }) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('Массив меньше двух элементов');
  }
  const x = arr[len - 1];

  let statusMA;
  const percentDifference = ((x - currentPrice) / currentPrice) * 100;

  x > currentPrice ? (statusMA = '🔴') : (statusMA = '🟢');
  return `${statusMA}${MA} ${x.toFixed(2)} / ${percentDifference.toFixed(2)}%`;
};

module.exports = templateMessageMA;
