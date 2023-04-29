const createOrder = async (client, symbol, side, type, quantity, price) => {
  try {
    const order = await client.order({
      symbol,
      side,
      type,
      quantity,
      price,
    });
    return order;
  } catch (err) {
    console.error(`Error creating limit order ${symbol}:`, err);
    return [];
  }
};

module.exports = createOrder;
