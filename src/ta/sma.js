const sma = (data, length = 14) => {
  const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);
  const smaResult = [];

  for (let i = length; i <= data.length; i++) {
    const avg = sum(data.slice(i - length, i));
    smaResult.push(avg / length);
  }

  return smaResult;
};

export default sma;
