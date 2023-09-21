const getLotParams = async (client, symbol) => {
  try {
    const { filters } = (await client.exchangeInfo()).symbols.find(
      (s) => s.symbol === symbol,
    );
    const lotSizeFilter = filters.find((f) => f.filterType === 'LOT_SIZE');
    const priceFilter = filters.find((f) => f.filterType === 'PRICE_FILTER');
    return { stepSize: lotSizeFilter.stepSize, tickSize: priceFilter.tickSize };
  } catch (err) {
    console.error(`Error in getLotSizeParams of ${symbol}:`, err);
    return {};
  }
};

export default getLotParams;
