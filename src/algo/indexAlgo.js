const createOrder = require('./createOrder');
const tradeAlgo = require('./tradeAlgo');
const cancelOrders = require('./cancelOrders');
const filterCoins = require('./filterCoins');
const orderExist = require('./ordersExist');
const createBuyOrder = require('./createBuyOrder');
const createSellOrder = require('./createSellOrder');
const searchSignal = require('./searchSignal');

module.exports = {
  createOrder,
  searchSignal,
  cancelOrders,
  filterCoins,
  orderExist,
  createBuyOrder,
  createSellOrder,
  tradeAlgo,
};
