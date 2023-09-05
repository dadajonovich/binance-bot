const averageTrueRange = (closePrices, highPrice, lowPrice, length = 14) => {
  const atr = [];

  for (let i = 0; i < closePrices.length; i++) {
    let tr;
    if (i === 0) {
      tr = highPrice[i] - lowPrice[i];
    } else {
      tr = Math.max(
        highPrice[i] - lowPrice[i],
        Math.abs(highPrice[i] - closePrices[i - 1]),
        Math.abs(lowPrice[i] - closePrices[i - 1])
      );
    }

    let atrValue = 0;
    if (i < length) {
      atrValue = tr;
    } else {
      atrValue = (atr[i - 1] * (length - 1) + tr) / length;
    }
    atr.push(atrValue);
  }

  return atr;
};

export default averageTrueRange;
