const std = (data, length = data.length) => {
  const arrStd = [];
  for (let i = 0; i <= data.length - length; i++) {
    const sliceData = data.slice(i, i + length);
    const mean = sliceData.reduce((a, b) => a + b) / length;
    // console.log(sliceData);
    arrStd.push(
      Math.sqrt(sliceData.reduce((sq, n) => sq + (n - mean) ** 2, 0) / length)
    );
  }
  return arrStd;
};

export default std;
