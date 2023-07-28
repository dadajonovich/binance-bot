const orderExist = async (client, pair, getOpenOrders) => {
  const openOrders = await getOpenOrders(client, pair);

  const buyOrderExists = openOrders.some(
    (order) =>
      order.side === 'BUY' &&
      (order.status === 'NEW' || order.status === 'PARTIALLY_FILLED')
  );
  const sellOrderExists = openOrders.some(
    (order) =>
      order.side === 'SELL' &&
      (order.status === 'NEW' || order.status === 'PARTIALLY_FILLED')
  );

  return { buyOrderExists, sellOrderExists };
};

module.exports = orderExist;
