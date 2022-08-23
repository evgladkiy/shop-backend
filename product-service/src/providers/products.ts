import { Product } from '../models';
import { products } from '../mock/products';

/**
 * Handle all communication with the products
 */
export class ProductsProvider {
  async getProducts(): Promise<Array<Product>> {
    // Return mocked data for task 3
    return products;
  }
}