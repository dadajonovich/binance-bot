const templateMessageIndicator = (MA, arr) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('An array of less than two elements');
  }
  const y = arr.at(-2);
  const x = arr.at(-1);

  const percentDifference = ((Math.abs(x) - Math.abs(y)) / Math.abs(y)) * 100;

  let statusIndicators;
  if (x > y) {
    statusIndicators = '📈';
  } else statusIndicators = '📉';

  return `${statusIndicators}${MA} ${y.toFixed(4)} to ${x.toFixed(
    4
  )} / ${percentDifference.toFixed(2)}%`;
};

module.exports = templateMessageIndicator;
