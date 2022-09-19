const stocks = require('./stocks');
const { resetTable } = require('./resetTable');

const STOCK_TABLE_NAME = 'Stocks';

const getCreateStockParams = (stock) => ({
  TableName: STOCK_TABLE_NAME,
  Item: {
    id: {
      S: stock.id
    },
    count: {
      N: String(stock.count)
    }
  }
});

resetTable(STOCK_TABLE_NAME, stocks, getCreateStockParams);