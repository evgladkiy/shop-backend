import type { AWS } from '@serverless/typescript';

import getProductList from '@functions/getProductList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';

import { CREATE_PRODUCT_TOPIC_NAME, DEPLOY_REGION } from 'src/constants';
import { resources } from 'src/sls/resources';
import { custom } from 'src/sls/custom';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: DEPLOY_REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_TOPIC_ARN: 'arn:aws:sns:${aws:region}:${aws:accountId}:' + CREATE_PRODUCT_TOPIC_NAME
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:GetItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:DeleteItem',
          'dynamodb:UpdateItem',
          'dynamodb:PutItem'
        ],
        Resource: `arn:aws:dynamodb:${DEPLOY_REGION}:*:table/*`
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: `arn:aws:sns:${DEPLOY_REGION}:*:${CREATE_PRODUCT_TOPIC_NAME}`        
      }
    ]
  },
  functions: { 
    getProductList,
    getProductById,
    createProduct,
    catalogBatchProcess
  },
  package: { 
    individually: true
  },
  resources,
  custom
};

module.exports = serverlessConfiguration;
