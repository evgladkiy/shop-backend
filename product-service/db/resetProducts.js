const products = require('./products');
const { resetTable } = require('./resetTable');

const PRODUCT_TABLE_NAME = 'Products';

const getCreateProductParams = (product) => ({
  TableName: PRODUCT_TABLE_NAME,
  Item: {
    id: {
      S: product.id
    },
    description: {
      S: product.description
    },
    img: {
      S: product.img
    },
    price: {
      N: String(product.price)
    },
    title: {
      S: product.title
    },
    weight: {
      N: String(product.weight)
    }
  }
});

resetTable(PRODUCT_TABLE_NAME, products, getCreateProductParams);