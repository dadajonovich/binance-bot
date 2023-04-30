const getOpenOrders = async (client, pair = '') => {
  try {
    let openOrders;
    if (!pair) {
      openOrders = await client.openOrders();
      console.log(openOrders);
    } else {
      openOrders = await client.openOrders({ symbol: pair });
      console.log(openOrders);
    }

    return openOrders;
  } catch (err) {
    console.error('Error in getOpenOrders:', err);
    return [];
  }
};

module.exports = getOpenOrders;
