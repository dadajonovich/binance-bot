function calculateSMA(values, period) {
  if (values.length < period) {
    throw new Error(`Not enough values to calculate SMA with period ${period}`);
  }

  const sum = values.slice(-period).reduce((acc, val) => acc + val, 0);
  return sum / period;
}

module.exports = { calculateSMA };
