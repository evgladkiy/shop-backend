import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from 'src/models';

import { HttpResponse } from '../../helpers';
import { ProductProvider } from '../../providers';

const productsProvider = new ProductProvider();

const createProduct: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('CreateProduct Lambda: Function execution is stated with event - ', JSON.stringify(event));

  try {
    const product = event?.body as unknown;
    const dbProduct = await productsProvider.createProduct(product as Product);
    console.log('CreateProduct Lambda: Product created successfully - ', dbProduct);
    return HttpResponse.success(dbProduct);
  } catch (error) {
    console.log('CreateProduct Lambda: Product creation error - ', error);
    return HttpResponse.serverError({
      error: 'Server Error',
      request: event
    });
  }
};

export const main = middyfy(createProduct);
