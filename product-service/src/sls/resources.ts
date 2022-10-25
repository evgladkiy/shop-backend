import { CATALOG_PRODUCT_QUEUE_NAME, PRODUCT_TABLE_NAME, STOCK_TABLE_NAME } from 'src/constants';

export const resources = {
  Resources: {
    ProductTable: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        TableName: PRODUCT_TABLE_NAME,
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [{
          AttributeName: 'id',
          KeyType: 'HASH'
        }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        },
      }
    },
    StockTable: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        TableName: STOCK_TABLE_NAME,
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [{
          AttributeName: 'id',
          KeyType: 'HASH'
        }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        },
      }
    },
    SQSQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: CATALOG_PRODUCT_QUEUE_NAME
      }
    }
  }
}