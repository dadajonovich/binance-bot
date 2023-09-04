const averageTrueRange = (data, length = 14) => {
  const atr = [data[0][0] - data[0][2]];
  for (let i = 1; i < data.length; i++) {
    const t0 = Math.max(
      data[i][0] - data[i - 1][1],
      data[i][2] - data[i - 1][1],
      data[i][0] - data[i][2]
    );
    atr.push((atr[atr.length - 1] * (length - 1) + t0) / length);
  }
  return atr;
};

export default averageTrueRange;
