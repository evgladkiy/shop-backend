import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { HttpResponse } from '../../helpers';
import { ProductProvider } from '../../providers';

const productsProvider = new ProductProvider();

const getProductList: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('GetProductList Lambda: Function execution is stated with event - ', JSON.stringify(event));

  try {
    console.log('GetProductList Lambda: Try to retrieve productList');
    const products = await productsProvider.getProducts();
    console.log('GetProductList Lambda: ProductList retrieved successfully - ', products);
    return HttpResponse.success(products);
  } catch (error) {
    console.log('GetProductList Lambda: ProductList retrieving error - ', error);
    return HttpResponse.serverError({
      error: 'Server Error',
      request: event
    });
  }
};

export const main = middyfy(getProductList);
