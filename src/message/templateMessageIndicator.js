const templateMessageIndicator = (MA, arr) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('An array of less than two elements');
  }
  const y = arr.at(-2);
  const x = arr.at(-1);

  let statusIndicators;
  if (x > y) {
    statusIndicators = '📈';
  } else statusIndicators = '📉';

  return `${statusIndicators}${MA} ${y.toFixed(2)} to ${x.toFixed(2)}`;
};

module.exports = templateMessageIndicator;
