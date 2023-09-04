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

// const closePrice = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169, 6195, 6222, 6186,
//   6214, 6185, 6209, 6221, 6278, 6326, 6347, 6420, 6394, 6400, 6446, 6442, 6543,
//   6550, 6442, 6516, 6597, 6568, 6580, 6610, 6682, 6537, 6552, 6563, 6573, 6498,
//   6593,
// ];

// console.log(ema(closePrice).length);
