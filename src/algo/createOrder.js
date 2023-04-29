const createOrder = async (client, symbol, side, type, quantity, price) => {
  try {
    const order = await client.order({
      symbol,
      side,
      type,
      quantity,
      price,
    });
    console.log(order);
    return order;
  } catch (err) {
    console.error('Error creating limit order:', err);
    return [];
  }
};

module.exports = createOrder;
