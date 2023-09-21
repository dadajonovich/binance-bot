const getOrdersMessage = (orders) => {
  let message = '';
  message += orders
    .map(
      (order) => `\nCoin: ${order.symbol}
- orderId: ${order.orderId}
- price: ${parseFloat(order.price)}$
- quantity: ${parseFloat(order.origQty)}
- status: ${order.status},
- type: ${order.type},
- side: ${order.side}
`,
    )
    .join('');
  return message;
};

export default getOrdersMessage;
