import sma from './sma.js';

const kaufmanMovingAverage = (data, len1 = 10, len2 = 2, len3 = 30) => {
  const kama = [sma(data, len1).at(-1)];
  const fasted = 2 / (len2 + 1);
  const slowest = 2 / (len3 + 1);

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
    kama.push(kama.at(-1) + smooth * (data[i] - kama.at(-1)));
  }
  return kama;
};

export default kaufmanMovingAverage;

// const array = [
//   100, 102, 105, 110, 115, 120, 118, 122, 130, 135, 140, 138, 145, 148, 155,
//   160, 158, 162, 170, 175, 180, 182, 185, 190, 195, 200, 202, 205, 210, 215,
//   220, 225, 230, 235, 240,
// ];

// console.log(kaufmanMovingAverage(array));
