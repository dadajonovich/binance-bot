const getLotParams = async (client, symbol) => {
  try {
    const exchangeInfo = await client.exchangeInfo();
    const { symbols } = exchangeInfo;
    const coinInfo = symbols.find((s) => s.symbol === symbol);

    const lotSizeFilter = coinInfo.filters.find(
      (f) => f.filterType === 'LOT_SIZE'
    );
    const { stepSize } = lotSizeFilter;

    const priceFilter = coinInfo.filters.find(
      (f) => f.filterType === 'PRICE_FILTER'
    );

    const { tickSize } = priceFilter;

    return { stepSize, tickSize };
  } catch (err) {
    console.error(`Error in getLotSizeParams of ${symbol}`, err);
    return {};
  }
};

module.exports = getLotParams;
