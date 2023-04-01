const getConfig = () => {
  return {
    binanceApiKey:
      'Mwyek91lg0az1UUzh5W8ql2FZTtoDgQXqKei12yVt3AvKnASRMWbDenGle6cCXCj',
    binanceApiSecret:
      '85VgZUt5RlY9ZX79V5BHZELLv1gIIPOeksZzD1ROtIt4RI8J9aOVkFCO3XZ7XkeU',
    telegramBotToken: '6057048590:AAH1Yi8k_sZuifJ-y2sBbg76bCc7miV4kaA',
    telegramChatId: '521450044',
    pairsToMonitor: ['BTCUSDT', 'ETHUSDT'], // список пар, которые нужно мониторить
  };
};

module.exports = getConfig;
