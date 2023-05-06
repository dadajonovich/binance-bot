const orderExist = async (client, pair, getOpenOrders) => {
  const openOrders = await getOpenOrders(client, pair);

  const buyOrderExists = openOrders.some(
    (order) => order.side === 'BUY' && order.status === 'NEW'
  );
  const sellOrderExists = openOrders.some(
    (order) => order.side === 'SELL' && order.status === 'NEW'
  );

  return { buyOrderExists, sellOrderExists };
};

module.exports = orderExist;
