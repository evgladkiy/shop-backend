import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { HttpResponse } from '../../helpers';
import { ProductsProvider } from '../../providers/products';

const productsProvider = new ProductsProvider();

const getProductList: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const products = await productsProvider.getProducts();
  
  return HttpResponse.success(products);
};

export const main = middyfy(getProductList);
