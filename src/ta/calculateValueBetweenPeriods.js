const calculateValueBetweenPeriods = (array) => {
  const valueDifferences = [];
  for (let i = 1; i < array.length; i++) {
    const difference = array[i] - array[i - 1];
    // console.log(`${array[i]} - ${array[i - 1]}`);
    valueDifferences.push(difference);
  }
  // console.log(valueDifferences);
  return valueDifferences;
};

export default calculateValueBetweenPeriods;
