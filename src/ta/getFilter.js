import getValueBetweenPeriods from './getValueBetweenPeriods.js';
import std from './stdArray.js';

const getFilter = (data) => {
  const valueBetweenPeriods = getValueBetweenPeriods(data);
  const filter = std(valueBetweenPeriods, 20);
  return filter;
};

export default getFilter;
