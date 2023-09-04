import averageTrueRange from './atr.js';
import ema from './ema.js';

function keltner(closePrices, highPrice, lowPrice, length = 20, devi = 2) {
  const data = closePrices.map((closePrice, index) => [
    highPrice[index],
    closePrice,
    lowPrice[index],
  ]);
  const atr = averageTrueRange(data, length);
  // console.log(atr.length);
  const emaValues = ema(closePrices, length);
  // console.log(emaValues.length);
  const keltnerBands = [];

  atr.splice(0, length - 1);
  // console.log(atr.length);
  for (let i = 0; i < emaValues.length; i++) {
    const upperBand = emaValues[i] + atr[i] * devi;
    const middleBand = emaValues[i];
    const lowerBand = emaValues[i] - atr[i] * devi;
    keltnerBands.push([upperBand, middleBand, lowerBand]);
  }

  return { keltnerBands, atr };
}

export default keltner;

// const closePrice = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169, 6195, 6222, 6186,
//   6214, 6185, 6209, 6221, 6278, 6326, 6347, 6420, 6394, 6400, 6446, 6442, 6543,
//   6550, 6442, 6516, 6597, 6568, 6580, 6610, 6682, 6537, 6552, 6563, 6573, 6498,
//   6593,
// ];
// const highPrice = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169, 6195, 6222, 6186,
//   6214, 6185, 6209, 6221, 6278, 6326, 6347, 6420, 6394, 6400, 6446, 6442, 6543,
//   6550, 6442, 6516, 6597, 6568, 6580, 6610, 6682, 6537, 6552, 6563, 6573, 6498,
//   6593,
// ];

// const lowPrice = [
//   6063, 6041, 6065, 6078, 6114, 6121, 6106, 6101, 6166, 6169, 6195, 6222, 6186,
//   6214, 6185, 6209, 6221, 6278, 6326, 6347, 6420, 6394, 6400, 6446, 6442, 6543,
//   6550, 6442, 6516, 6597, 6568, 6580, 6610, 6682, 6537, 6552, 6563, 6573, 6498,
//   6593,
// ];

// keltner(closePrice, highPrice, lowPrice);
