import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpResponse } from 'src/helpers';
import { middyfy } from '@libs/lambda';
import { DEPLOY_REGION, UPLOAD_S3_BUCKET_NAME } from 'src/constants';

const importProductsFile: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const name = event.queryStringParameters.name;
  if (name) {
    const s3 = new S3Client({ region: DEPLOY_REGION })

    const putObjectParams = {
        Bucket: UPLOAD_S3_BUCKET_NAME,
        Key: `uploaded/${name}`,
    };
    const command = new PutObjectCommand(putObjectParams);
    const url = await getSignedUrl(s3, command);

    return HttpResponse.success({ url });
  }

  return HttpResponse.badRequest({
    name: `bad request`,
    event,
  });
};

export const main = middyfy(importProductsFile);
