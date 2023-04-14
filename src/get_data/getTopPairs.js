const getTopPairs = async (client, quantityPairs = 1) => {
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
    console.error('Ошибка в запросе топовых пар', err);
    return [];
  }
};

module.exports = getTopPairs;
