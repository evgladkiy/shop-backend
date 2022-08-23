import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { HttpResponse } from '../../helpers';
import { ProductsProvider } from '../../providers';

const productsProvider = new ProductsProvider();

const getProductById: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const products = await productsProvider.getProducts();
  const { pathParameters } = event;
  const product = products.find(product => product.id === pathParameters.productId);

  return HttpResponse.success(product)
};

export const main = middyfy(getProductById);
