const buySignalKaufman = (ama, filter) => {
  const criterionFilter = [];
  const dataKama = ama.slice(-5, -1);
  const dataFilter = filter.slice(-5, -1);
  // console.log(dataKama);
  // console.log(dataFilter);
  for (let i = 1; i < dataKama.length; i++) {
    const betweenPeriods = dataKama[i] - dataKama[i - 1];
    // console.log(`${dataKama[i]} - ${dataKama[i - 1]} > ${dataFilter[i]}`);
    if (betweenPeriods > dataFilter[i]) {
      criterionFilter.push(true);
    } else criterionFilter.push(false);
  }
  const criterionBuy = criterionFilter.every((elem) => elem === true);
  // console.log(criterionBuy);
  return criterionBuy;
};

// const buySignalKaufman = (ama, filter) => {
//   let criterionBuy = false;
//   const betweenPeriods = ama.at(-2) - ama.at(-3);

//   if (betweenPeriods > filter.at(-2)) {
//     criterionBuy = true;
//   }

//   return criterionBuy;
// };

const filterCoins = (coins) => {
  const filteredCoins = coins.filter((coin) =>
    buySignalKaufman(coin.kama, coin.filterKama)
  );
  console.log(filteredCoins);

  return filteredCoins.slice(0, 1);
};

export default filterCoins;

// const filter = [
//   3.628816967897631, 3.229804286556808, 3.2596700172784456, 3.2807633392772857,
//   3.0700198416952937, 3.0842987708907965, 2.8922866194076433, 2.809642273358212,
//   0.9702938205547034, 1.1350649340153947, 1.6167358583486153,
//   1.6126707761298806, 1.5773150026450027, 1.6433310017728564,
//   1.5299697280472222, 2.0128615008468613, 1.8224643018836382,
//   2.2008255109494343, 2.3838267601946943, 2.4133703597473533,
//   2.4917218242069206, 2.5445105584947867, 2.574960434831225, 2.535028355716252,
//   2.597718048655824, 1.7558938267210382, 1.035022774700774, 0.9689194152712294,
//   1.0155768709279633, 0.9322801177960288,
// ];

// const ama = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169,
//   6173.8633953257995, 6188.834223220775, 6188.430925674707, 6192.414842335993,
//   6191.980911048277, 6193.220691200195, 6196.358249615615, 6210.195220657128,
//   6228.4229321449675, 6248.600756698224, 6282.719402924608, 6296.908873143119,
//   6318.935240872848, 6347.362412909954, 6376.271518891558, 6431.390105480862,
//   6470.440626721937, 6468.065992324839, 6472.673287116851, 6487.965105840851,
//   6492.943657392142, 6500.980186010626, 6512.250934708962, 6531.7419807408605,
//   6531.862378839739, 6531.972574950088, 6532.161746689747, 6534.30701550104,
//   6534.031595997395, 6534.315542290985,
// ];

// buySignalKaufman(ama, filter);
