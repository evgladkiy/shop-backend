const AWS = require('aws-sdk');

const products = require('./products');
const { getCreateParams, getDeleteParams } = require('./helpers');
const { DEPLOY_REGIN, PRODUCT_TABLE_NAME, API_VERSION } = require('./constants');

AWS.config.update({
  region: DEPLOY_REGIN
});

const dynamoDB = new AWS.DynamoDB({
  apiVersion: API_VERSION
});

dynamoDB.scan({ TableName: PRODUCT_TABLE_NAME }, async function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    const dbProducts = data.Items;
    for (let dbProduct of dbProducts) {
      await deleteItem(dbProduct.id);
    }
    for (let product of products) {
      await createItem(product);
    }
  }
});

const deleteItem = async(id) => {
  const params = getDeleteParams(id);
  await dynamoDB.deleteItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log('Item deleted');
    }
  });
};

const createItem = async(product) => {
  const params = getCreateParams(product);
  await dynamoDB.putItem(params, function(err) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log(`Item created - ${product.id}`);
    }
  });
};

