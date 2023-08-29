const ema = (data, length = 12) => {
  const emaResult = [];
  const weight = 2 / (length + 1);
  for (let i = length; i <= data.length; i++) {
    if (emaResult.length > 0) {
      emaResult.push(
        (data[i - 1] - emaResult[emaResult.length - 1]) * weight +
          emaResult[emaResult.length - 1]
      );
    } else {
      const slice = data.slice(i - length, i);
      const sum = slice.reduce((acc, val) => acc + val, 0);
      emaResult.push(sum / length);
    }
  }
  return emaResult;
};

export default ema;
