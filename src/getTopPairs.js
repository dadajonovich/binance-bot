async function getTopPairs(client, quantityPairs = 1) {
  const exchangeInfo = await client.exchangeInfo();
  const symbols = exchangeInfo.symbols;
  const pairsByVolume = symbols
    .filter(
      (symbol) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
    )
    .map((symbol) => {
      const baseAsset = symbol.baseAsset;
      const quoteAsset = symbol.quoteAsset;
      const volume = symbol.volume;
      return { pair: `${baseAsset}${quoteAsset}`, volume };
    })
    .sort((a, b) => b.volume - a.volume);
  const topPairs = pairsByVolume
    .slice(0, quantityPairs)
    .map((pair) => pair.pair);
  return topPairs;
}

module.exports = getTopPairs;
