const { PRODUCT_TABLE_NAME } = require('./constants');

module.exports.getDeleteParams = (idParams) => ({
  TableName: PRODUCT_TABLE_NAME,
  Key: {
      id: idParams
  }
});

module.exports.getCreateParams = (product) => ({
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