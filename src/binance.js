const Binance = require('binance-api-node').default;
const getConfig = require('./config.js');

const { binanceApiKey, binanceApiSecret } = getConfig();

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

async function getCurrentPrice(symbol) {
  const ticker = await client.book({ symbol, limit: 1 });
  const price = parseFloat(ticker.bids[0].price);
  return price;
}

module.exports = getCurrentPrice;
