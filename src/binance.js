const Binance = require('binance-api-node').default;
const getConfig = require('./config.js');

const { binanceApiKey, binanceApiSecret } = getConfig();

const client = Binance({
  apiKey: binanceApiKey,
  apiSecret: binanceApiSecret,
});

module.exports = client;
