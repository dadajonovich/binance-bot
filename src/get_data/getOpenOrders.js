const getOpenOrders = async (client, symbol = null) => {
  try {
    const openOrders = symbol
      ? await client.openOrders({ symbol })
      : await client.openOrders();
    return openOrders;
  } catch (err) {
    console.error('Error in open orders request:', err);
    return [];
  }
};

module.exports = getOpenOrders;
