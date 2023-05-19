const templateMessageMA = (MA, arr, { currentPrice }) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('An array of less than two elements');
  }

  const y = arr.at(-2);
  const x = arr.at(-1);

  let statusMA;

  if (x > currentPrice) {
    statusMA = '🔴';
  } else statusMA = '🟢';

  return `${statusMA}${MA} ${y.toFixed(2)} to ${x.toFixed(2)}`;
};

module.exports = templateMessageMA;
