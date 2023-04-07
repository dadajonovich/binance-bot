const getTopPairs = async (client, quantityPairs = 1) => {
  const exchangeInfo = await client.exchangeInfo();
  const { symbols } = exchangeInfo;
  const pairsByVolume = symbols
    .filter(
      (symbol) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
    )
    .map((symbol) => {
      const { baseAsset } = symbol;
      const { quoteAsset } = symbol;
      const { volume } = symbol;
      return { pair: `${baseAsset}${quoteAsset}`, volume };
    })
    .sort((a, b) => b.volume - a.volume);
  const topPairs = pairsByVolume
    .slice(0, quantityPairs)
    .map((pair) => pair.pair);
  return topPairs;
};

module.exports = getTopPairs;
