const cancelOrders = async (client, coins) => {
  try {
    const cancelOrdersPromises = await Promise.all(
      coins.map(async (coin) => {
        const { symbol, orderId } = coin;
        await client.cancelOrder({
          symbol,
          orderId,
        });
      })
    );

    return cancelOrdersPromises;
  } catch (err) {
    console.error('Error creating limit order:', err);
    return [];
  }
};

module.exports = cancelOrders;
