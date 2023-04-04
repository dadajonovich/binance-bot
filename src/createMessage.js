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

const getMessage = (MA, arr, fnCreateMessage, { currentPrice } = {}) => {
  let result = '';
  const str = fnCreateMessage(MA, arr, { currentPrice });
  result += `${str}`;

  return result;
};

module.exports = { templateMessageIndicator, templateMessageMA, getMessage };
