const createOrder = async (
  client,
  symbol,
  side,
  type,
  quantity,
  price = null
) => {
  try {
    const orderParams = {
      symbol,
      side,
      type,
      quantity,
      recvWindow: 30000,
    };
    if (price !== null) {
      orderParams.price = price;
    }
    await client.order(orderParams);
  } catch (err) {
    console.error(`Error in createOrder ${symbol}:`, err);
  }
};

export default createOrder;
