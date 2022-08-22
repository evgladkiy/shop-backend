import { Product } from 'src/models/product.model';

import { products } from '../mock/products';

/**
 * Handle all communication with the products
 */
export class ProductsProvider {

  // Return mocked data for task 3
  async getProducts(): Promise<Array<Product>> {
    return products;
  }
}