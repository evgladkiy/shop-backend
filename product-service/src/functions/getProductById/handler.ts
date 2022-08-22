import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { ProductsProvider } from '../../providers/products';

const productsProvider = new ProductsProvider();

const getProductById: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const products = await productsProvider.getProducts();
  const { pathParameters } = event;
  const product = products.find(product => product.id === pathParameters.productId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(product)
  }
};

export const main = middyfy(getProductById);
