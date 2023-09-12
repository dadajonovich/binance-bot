const getATR = (closePrices, highPrice, lowPrice, length = 14) => {
  const atr = [highPrice[0] - lowPrice[0]];

  for (let i = 1; i < closePrices.length; i++) {
    const tr = Math.max(
      highPrice[i] - lowPrice[i],
      Math.abs(highPrice[i] - closePrices[i - 1]),
      Math.abs(lowPrice[i] - closePrices[i - 1])
    );

    const atrValue = (atr[i - 1] * (length - 1) + tr) / length;

    atr.push(atrValue);
  }

  return atr;
};

export default getATR;
