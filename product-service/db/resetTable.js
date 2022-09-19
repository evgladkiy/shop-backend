const AWS = require('aws-sdk');

const DEPLOY_REGIN = 'eu-west-1';
const API_VERSION = '2012-08-10';

AWS.config.update({
  region: DEPLOY_REGIN
});

const dynamoDB = new AWS.DynamoDB({
  apiVersion: API_VERSION
});

const getDeleteParams = (table, idParams) => ({
  TableName: table,
  Key: {
      id: idParams
  }
});

const deleteItem = async(table, id) => {
  const params = getDeleteParams(table, id);
  await dynamoDB.deleteItem(params, (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log('Item deleted');
    }
  });
};

const createItem = async(params) => {
  await dynamoDB.putItem(params, (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log('Item created');
    }
  });
};

module.exports.resetTable = async (table, items, paramsHandler) => {
  await dynamoDB.scan({ TableName: table }, async function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      const dbItems = data.Items;
      for (let dbItem of dbItems) {
        await deleteItem(table, dbItem.id);
      }
      for (let item of items) {
        const params = paramsHandler(item);
        await createItem(params);
      }
    }
  });
};
