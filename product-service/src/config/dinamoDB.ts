import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PRODUCT_DB_PORT } from '../constants';

const dynamoDBClient = (): DocumentClient => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: `http://localhost:${PRODUCT_DB_PORT}`,
    });
  }
  return new AWS.DynamoDB.DocumentClient();
};

export const dbClient = dynamoDBClient();
