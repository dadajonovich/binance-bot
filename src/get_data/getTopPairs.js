const getTopPairs = async (client, { quantityPairs = 50 } = {}) => {
  try {
    const exchangeInfo = await client.exchangeInfo();
    const { symbols } = exchangeInfo;
    const topPairs = symbols
      .filter(
        (symbol) =>
          symbol.status === 'TRADING' &&
          symbol.quoteAsset === 'USDT' &&
          !symbol.symbol.includes('DOWN')
      )
      .map((symbol) => `${symbol.baseAsset}${symbol.quoteAsset}`)
      .slice(0, quantityPairs);
    return topPairs;
  } catch (err) {
    console.error('Error in getTopPairs', err);
    return [];
  }
};

module.exports = getTopPairs;
