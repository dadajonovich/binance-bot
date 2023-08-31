const efficiencyRatio = (data, length) => {
  const er = [];
  for (let i = length; i < data.length; i++) {
    let volatility = 0;
    const direction = Math.abs(data[i] - data[i - length]);
    for (let a = 0; a < length; a++) {
      volatility += Math.abs(data[i - a] - data[i - a - 1]);
    }

    er.push(direction / volatility);
  }
  // console.log(er);
  return er;
};

export default efficiencyRatio;

// const array = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169, 6195, 6222, 6186,
//   6214, 6185, 6209, 6221, 6278, 6326, 6347, 6420, 6394, 6400, 6446, 6442, 6543,
//   6550, 6442, 6516, 6597, 6568, 6580, 6610, 6682, 6537, 6552, 6563, 6573, 6498,
//   6593,
// ];
// efficiencyRatio(array, 10);
