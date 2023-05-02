const createOrder = async (client, symbol, side, type, quantity, price) => {
  try {
    await client.order({
      symbol,
      side,
      type,
      quantity,
      price,
      recvWindow: 30000,
    });
  } catch (err) {
    console.error(`Error in createOrder ${symbol}:`, err);
  }
};

module.exports = createOrder;
