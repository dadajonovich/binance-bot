const getLotSizeParams = async (client, symbol) => {
  try {
    const exchangeInfo = await client.exchangeInfo();
    const { symbols } = exchangeInfo;
    const coinInfo = symbols.find((s) => s.symbol === symbol);

    const lotSizeFilter = coinInfo.filters.find(
      (f) => f.filterType === 'LOT_SIZE'
    );
    return lotSizeFilter.stepSize;
  } catch (err) {
    console.error(`Error in the request for lot size of ${symbol}`, err);
    return {};
  }
};

module.exports = getLotSizeParams;
