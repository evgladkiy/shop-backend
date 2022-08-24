import { handlerPath } from '@libs/handler-resolver';
import { default as documentation } from './docs';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        cors: true,
        ...documentation
      },
    },
  ],
};
