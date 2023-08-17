const cancelOrders = async (client, coins) => {
  try {
    coins.forEach(async (coin) => {
      const { symbol, orderId } = coin;
      await client.cancelOrder({
        symbol,
        orderId,
        recvWindow: 30000,
      });
    });
  } catch (err) {
    console.error('Error cancel limit order:', err);
  }
};

export default cancelOrders;
