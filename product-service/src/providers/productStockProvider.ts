import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dbClient } from 'src/config/dinamoDB';
import { STOCK_TABLE_NAME } from 'src/constants';
import { ProductStock } from 'src/models';

/**
 * Handle all communication with the Product Stocks
 */
export class ProductStockProvider {
  private tableName: string = STOCK_TABLE_NAME;
  private client: DocumentClient = dbClient;

  async getStocks(): Promise<Array<ProductStock>> {
    console.log('ProductStockProvider: GetStocks call received');
    try {
      console.log('ProductStockProvider: Try to retrieve stocks from DB');
      const products = await this.client.scan({
        TableName: this.tableName,
      }).promise();
      console.log('ProductStockProvider: Stocks retrieved successfully');
     return products.Items as Array<ProductStock>;
    } catch (error)  {
      console.log('ProductStockProvider: Error while retrieving stocks from DB - ', error);
    }
  }

  async getProductStock(id: string): Promise<ProductStock> {
    console.log('ProductStockProvider: GetProductStock call received');
    try {
      console.log('ProductStockProvider: Try to retrieve product stock from DB');
      const product = await this.client.get({
        TableName: this.tableName,
        Key: {
          id,
        }
      }).promise();
      console.log('ProductStockProvider: Product stock retrieved successfully');
     return product.Item as ProductStock;
    } catch (error)  {
      console.log('ProductStockProvider: Error while retrieving product stock from DB - ', error);
    }
  }
}