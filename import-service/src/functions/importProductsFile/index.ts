import { handlerPath } from '@libs/handler-resolver';
import { AUTH_LAMBDA_NAME } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          name: 'basicAuth',
          arn: 'arn:aws:lambda:${aws:region}:${aws:accountId}:function:' + AUTH_LAMBDA_NAME,
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        }
      },
    },
  ],
};