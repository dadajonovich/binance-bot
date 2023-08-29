import ema from './ema.js';
// import sma from './sma.js';

const kaufmanMovingAverage = (data, len1 = 10, len2 = 2, len3 = 30) => {
  const ka = [ema(data, len1).at(-1)];

  for (let i = len1 + 1; i < data.length; i++) {
    let vola = 0;
    const change = Math.abs(data[i] - data[i - len1]);
    for (let a = 1; a < len1; a++)
      vola += Math.abs(data[i - a] - data[i - a - 1]);
    const sc =
      ((change / vola) * (2 / (len2 + 1) - 2 / (len3 + 1) + 2 / (len3 + 1))) **
      2;
    ka.push(ka.at(-1) + sc * (data[i] - ka.at(-1)));
  }
  return ka;
};

export default kaufmanMovingAverage;
