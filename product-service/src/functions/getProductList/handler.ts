import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { products } from 'src/mock/products';

// import schema from './schema';

const getProductList: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(products)
  }
};

export const main = middyfy(getProductList);
