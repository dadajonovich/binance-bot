const templateMessageBollinger = (MA, arr) => {
  const len = arr.length;
  if (len < 2) {
    throw new Error('Массив меньше двух элементов');
  }
  const [lastUpper, lastMiddle, lastLower] = arr[arr.length - 1];

  const [penultimateUpper, penultimateMiddle, penultimateLower] =
    arr[arr.length - 2];

  return `❕${MA} U${lastUpper.toFixed(2)} / M${lastMiddle.toFixed(
    2
  )} / L${lastLower.toFixed(2)}`;
};

module.exports = templateMessageBollinger;
