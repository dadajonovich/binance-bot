const kaufmanMovingAverage = (data, len1 = 10, len2 = 2, len3 = 30) => {
  const fasted = 2 / (len2 + 1);
  const slowest = 2 / (len3 + 1);
  const kama = data.slice(0, len1);

  for (let i = len1; i < data.length; i++) {
    let volatility = 0;
    const direction = Math.abs(data[i] - data[i - len1]);
    // console.log('One tick');
    // console.log(data[i], data[i - len1], direction);
    for (let a = 0; a < len1; a++) {
      volatility += Math.abs(data[i - a] - data[i - a - 1]);
      // console.log(data[i - a], data[i - a - 1], volatility);
    }

    const er = direction / volatility;
    // console.log(er);
    const smooth = (er * (fasted - slowest) + slowest) ** 2;
    // const smooth = er * (fasted - slowest) + slowest;
    // console.log(`${kama.at(-1)} + ${smooth} * (${data[i]} - ${kama.at(-1)})`);
    kama.push(kama.at(-1) + smooth * (data[i] - kama.at(-1)));
    // kama.push(data[i] * smooth + kama.at(-1) * (1 - smooth));
  }
  return kama;
};

export default kaufmanMovingAverage;

// const array = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169, 6195, 6222, 6186,
//   6214, 6185, 6209, 6221, 6278, 6326, 6347, 6420, 6394, 6400, 6446, 6442, 6543,
//   6550, 6442, 6516, 6597, 6568, 6580, 6610, 6682, 6537, 6552, 6563, 6573, 6498,
//   6593,
// ];

// console.log(kaufmanMovingAverage(array));
