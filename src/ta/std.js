const std = (data, length = data.length) => {
  if (length < data.length) data.splice(0, data.length - length);
  const mean = data.reduce((a, b) => a + b) / length;
  return Math.sqrt(data.reduce((sq, n) => sq + (n - mean) ** 2, 0) / length);
};

export default std;
