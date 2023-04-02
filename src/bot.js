const { calculateSMA } = require('./indicators.js');
const { client } = require('./binance.js');
const { bot, telegramChatId } = require('./telegram.js');

async function monitorPairs() {
  try {
    const prices = await Promise.all(
      pairsToMonitor.map((symbol) => client.book({ symbol, limit: 1 }))
    );

    if (!prices) {
      console.error('Error while monitoring pairs: prices is undefined');
      return;
    }

    const smas = prices.map((ticker) =>
      calculateSMA(
        ticker.bids.map((bid) => parseFloat(bid.price)),
        20
      )
    );

    console.log('SMA values:', smas);

    // отправка сообщения в Telegram с информацией о текущей цене и SMA для каждой пары
    pairsToMonitor.forEach((symbol, index) => {
      const price = parseFloat(prices[index].bids[0].price);
      const sma = smas[index];
      bot.sendMessage(
        telegramChatId,
        `${symbol}: Price = ${price.toFixed(2)}, SMA(20) = ${sma.toFixed(2)}`
      );
    });
  } catch (error) {
    console.error('Error while monitoring pairs:', error);
  }
}

setInterval(monitorPairs, 5000); // мониторить каждые 5 секунд
