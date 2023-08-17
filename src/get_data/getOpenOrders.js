const getOpenOrders = async (client, pair = '') => {
  try {
    let openOrders;
    if (!pair) {
      openOrders = await client.openOrders({ recvWindow: 30000 });
      console.log(openOrders);
    } else {
      openOrders = await client.openOrders({ symbol: pair, recvWindow: 30000 });
      console.log(openOrders);
    }

    return openOrders;
  } catch (err) {
    console.error('Error in getOpenOrders:', err);
    return [];
  }
};

export default getOpenOrders;
