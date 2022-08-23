import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { HttpResponse } from '../../helpers';
import { ProductsProvider } from '../../providers';

const productsProvider = new ProductsProvider();

const getProductById: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('GetProductById Lambda: Function execution is stated with event - ', JSON.stringify(event));

  const productId = event?.pathParameters?.productId;

  if (!productId) {
    console.log('GetProductById Lambda: Request is invalid - ', JSON.stringify(event));

    return HttpResponse.badRequest({
      error: `Request is invalid, 'productId' is missing`, 
      request: event,
    });
  }
  console.log('GetProductById Lambda: Try to retrieve productList');
  const products = await productsProvider.getProducts();
  console.log('GetProductList Lambda: ProductList retrieved successfully - ', products);
  console.log(`GetProductById Lambda: Try to find product with id ${productId}`);
  const product = products.find(product => product.id === productId);

  if (!product) {
    console.log(`GetProductById Lambda: Cannot find product with id ${productId}`);
    return HttpResponse.notFound({
      error: `Cannot find product with id - ${productId}`,
      request: event,
    })
  }

  console.log(`GetProductById Lambda: Product with id ${productId} is found - `, product);
  return HttpResponse.success(product)
};

export const main = middyfy(getProductById);
