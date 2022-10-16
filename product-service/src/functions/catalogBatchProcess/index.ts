import { handlerPath } from '@libs/handler-resolver';
import { DEPLOY_REGIN } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: `arn:aws:sqs:${DEPLOY_REGIN}:*:catalogProductsQueue`
      },
    },
  ]
};
