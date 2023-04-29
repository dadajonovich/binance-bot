const getOrdersMessage = (orders) => {
  let message = '';
  message += orders
    .map(
      (order) => `\nCoin: ${order.symbol}
- orderId: ${order.orderId}
- price: ${parseFloat(order.price).toFixed(4)}$
- quantity: ${parseFloat(order.origQty).toFixed(2)}
- status: ${order.status},
- type: ${order.type},
- side: ${order.side}
`
    )
    .join('');
  return message;
};

module.exports = getOrdersMessage;
