import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Product } from '../models';
import { PRODUCT_TABLE_NAME } from 'src/constants';
import { dbClient } from 'src/config/dinamoDB';

/**
 * Handle all communication with the products
 */
export class ProductsProvider {
  private tableName: string = PRODUCT_TABLE_NAME;
  private client: DocumentClient = dbClient;

  async getProducts(): Promise<Array<Product>> {
    console.log('ProductsProvider: GetProducts call received');
    try {
      console.log('ProductsProvider: Try to retrieve products from DB');
      const products = await this.client.scan({
        TableName: this.tableName,
      }).promise();
      console.log('ProductsProvider: Products retrieved successfully');
     return products.Items as Array<Product>;
    } catch (error)  {
      console.log('ProductsProvider: Error while retrieving products from DB - ', error);
    }
  }

  async getProduct(id: string): Promise<Product> {
    console.log('ProductsProvider: GetProduct call received');
    try {
      console.log('ProductsProvider: Try to retrieve product from DB');
      const product = await this.client.get({
        TableName: this.tableName,
        Key: {
          id,
        }
      }).promise();
      console.log('ProductsProvider: Product retrieved successfully');
     return product.Item as Product;
    } catch (error)  {
      console.log('ProductsProvider: Error while retrieving product from DB - ', error);
    }
  }
}