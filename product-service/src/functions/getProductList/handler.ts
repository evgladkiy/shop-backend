import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { ProductsProvider } from '../../providers/products';

const productsProvider = new ProductsProvider();

const getProductList: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const products = await productsProvider.getProducts();
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(products)
  }
};

export const main = middyfy(getProductList);
