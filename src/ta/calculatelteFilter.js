import std from './std.js';

const calculateFilter = (data, length1 = 10) => {
  const arrStd = [];
  for (let i = 0; i <= data.length - length1; i++) {
    arrStd.push(std(data.slice(i, i + length1)));
  }
  // console.log(arrStd);
  return arrStd;
};

export default calculateFilter;
