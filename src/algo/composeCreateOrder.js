const composeCreateOrder =
  (client, getValuesForOrder = (f) => f, createOrder = (f) => f) =>
  async (pair, quantityAsset, stepSize, tickSize, buyOrSell) => {
    try {
      const { [pair]: price } = await client.prices({ symbol: pair });
      const { roundedPrice, quantityBuy, quantitySell } = getValuesForOrder(
        Number(price),
        stepSize,
        tickSize,
        quantityAsset,
        pair
      );

      const quantityForOrder = buyOrSell === 'BUY' ? quantityBuy : quantitySell;

      await createOrder(
        client,
        pair,
        buyOrSell,
        'LIMIT',
        quantityForOrder,
        roundedPrice
      );
    } catch (err) {
      console.error('Error in composeCreateSellOrder', err);
    }
  };

module.exports = composeCreateOrder;
