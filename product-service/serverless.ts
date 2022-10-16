import type { AWS } from '@serverless/typescript';

import getProductList from '@functions/getProductList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

import { CATALOG_ITEM_QUEUE_NAME, DEPLOY_REGIN } from 'src/constants';
import { resources } from 'src/sls/resources';
import { custom } from 'src/sls/custom';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: DEPLOY_REGIN,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
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
        Resource: `arn:aws:dynamodb:${DEPLOY_REGIN}:*:table/*`
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: `arn:aws:sqs:${DEPLOY_REGIN}:*:${CATALOG_ITEM_QUEUE_NAME}`
        
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
