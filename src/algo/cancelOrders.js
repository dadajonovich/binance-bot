const cancelOrders = async (client, coins) => {
  try {
    await Promise.all(
      coins.map(async (coin) => {
        const { symbol, orderId } = coin;
        await client.cancelOrder({
          symbol,
          orderId,
        });
      })
    );
  } catch (err) {
    console.error('Error cancel limit order:', err);
  }
};

module.exports = cancelOrders;
