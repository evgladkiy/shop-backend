import { handlerPath } from '@libs/handler-resolver';
import { CATALOG_PRODUCT_QUEUE_NAME } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:' + CATALOG_PRODUCT_QUEUE_NAME
      },
    },
  ]
};
