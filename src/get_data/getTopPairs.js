const getTopPairs = async (client, { quantityPairs = 50 } = {}) => {
  try {
    const exchangeInfo = await client.exchangeInfo();
    const { symbols } = exchangeInfo;
    const pairsByVolume = symbols
      .filter(
        (symbol) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
      )
      .map((symbol) => ({
        pair: `${symbol.baseAsset}${symbol.quoteAsset}`,
        volume: parseFloat(symbol.volume),
      }))
      .sort((a, b) => b.volume - a.volume);
    const topPairs = pairsByVolume
      .slice(0, quantityPairs)
      .map((pair) => pair.pair);
    return topPairs;
  } catch (err) {
    console.error('Error in the request for top pairs', err);
    return [];
  }
};

module.exports = getTopPairs;
