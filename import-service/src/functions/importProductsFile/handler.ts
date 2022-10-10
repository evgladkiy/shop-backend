import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { HttpResponse } from 'src/helpers';
import { middyfy } from '@libs/lambda';
import { ImportFileService } from 'src/services';

const importFileService = new ImportFileService();

const importProductsFile: APIGatewayProxyHandler = async(event): Promise<APIGatewayProxyResult> => {
  console.log('ImportProductsFile Lambda: Function execution is stated with event - ', JSON.stringify(event));
  const fileName = event?.queryStringParameters?.name;

  if (!fileName) {
    console.log('ImportProductsFile Lambda: Request is invalid - ', JSON.stringify(event));
    return HttpResponse.badRequest({
      error: `Request is invalid, 'name' is missing`, 
      request: event,
    });
  }

  try {
    console.log('ImportProductsFile Lambda: Try to create signed url');
    const url = await importFileService.getUploadUrl(fileName);
    console.log(`ImportProductsFile Lambda: Signed url created successfully - ${url}`);
    return HttpResponse.success({ url });
  } catch(error) {
    console.log('Error while creating signed url - ', JSON.stringify(error));
    return HttpResponse.serverError({
      error: `Error while creating signed url - ${ JSON.stringify(error)}`, 
      request: event,
    });
  }
};

export const main = middyfy(importProductsFile);
