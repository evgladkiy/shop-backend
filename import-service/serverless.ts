import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importProductsParser from '@functions/importFileParser';
import { CATALOG_PRODUCT_QUEUE_NAME, DEPLOY_REGION, UPLOAD_S3_BUCKET_NAME } from 'src/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
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
      PRODUCTS_QUEUE_URL: 'https://sqs.${aws:region}.amazonaws.com/${aws:accountId}/' + CATALOG_PRODUCT_QUEUE_NAME
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: `arn:aws:s3:::${UPLOAD_S3_BUCKET_NAME}`
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: `arn:aws:s3:::${UPLOAD_S3_BUCKET_NAME}/*`
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: `arn:aws:sqs:${DEPLOY_REGION}:*:${CATALOG_PRODUCT_QUEUE_NAME}`
      }
    ]
  },
  // import the function via paths
  functions: { importProductsFile, importProductsParser },
  package: { individually: true },
  custom: {
    accountId: '!Ref AWS::AccountId',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
