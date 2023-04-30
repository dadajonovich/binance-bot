const getOpenOrders = async (client) => {
  try {
    const openOrders = await client.openOrders();
    console.log(openOrders);
    return openOrders;
  } catch (err) {
    console.error('Error in getOpenOrders:', err);
    return [];
  }
};

module.exports = getOpenOrders;
