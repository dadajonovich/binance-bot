function checkMinimumsIncrease(array, segments) {
  const segmentLength = Math.floor(array.length / segments);

  if (segmentLength * segments !== array.length) {
    throw new Error('Количество отрезков не равномерно делит массив');
  }

  const segmentsArray = [];
  for (let i = 0; i < array.length; i += segmentLength) {
    segmentsArray.push(array.slice(i, i + segmentLength));
  }
  const minimums = segmentsArray.map((segment) => Math.min(...segment));

  for (let i = 1; i < minimums.length; i++) {
    if (minimums[i] < minimums[i - 1]) {
      return false;
    }
  }
  return true;
}

// Пример использования
// const numbers = [1, 5, 2, 9, 3, 8, 4, 7];
// const numberOfSegments = 4;
// const result = checkMinimumsIncrease(numbers, numberOfSegments);
// console.log(result); // true

module.exports = checkMinimumsIncrease;
