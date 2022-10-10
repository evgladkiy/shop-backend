import { handlerPath } from '@libs/handler-resolver';
import { UPLOAD_S3_BUCKET_NAME } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: UPLOAD_S3_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: 'uploaded/',
        },
        {
          suffix: '.csv'
        }],
        existing: true
      },
    },
  ],
};