const createOrder = async (client, symbol, side, type, quantity, price) => {
  try {
    await client.order({
      symbol,
      side,
      type,
      quantity,
      price,
    });
  } catch (err) {
    console.error(`Error creating limit order ${symbol}:`, err);
  }
};

module.exports = createOrder;
