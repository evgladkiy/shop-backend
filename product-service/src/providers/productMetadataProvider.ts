import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ProductMetadata } from '../models';
import { PRODUCT_TABLE_NAME } from 'src/constants';
import { dbClient } from 'src/config/dinamoDB';

/**
 * Handle all communication with the ProductMetadata 
 */
export class ProductMetadataProvider {
  private tableName: string = PRODUCT_TABLE_NAME;
  private client: DocumentClient = dbClient;

  async getProductsMeta(): Promise<Array<ProductMetadata>> {
    console.log('ProductMetadataProvider: GetProductsMeta call received');
    try {
      console.log('ProductMetadataProvider: Try to retrieve productsMetadata from DB');
      const products = await this.client.scan({
        TableName: this.tableName,
      }).promise();
      console.log('ProductMetadataProvider: ProductsMetadata retrieved successfully');
     return products.Items as Array<ProductMetadata>;
    } catch (error)  {
      console.log('ProductMetadataProvider: Error while retrieving productsMetadata from DB - ', error);
    }
  }

  async getProductMeta(id: string): Promise<ProductMetadata> {
    console.log('ProductMetadataProvider: GetProductMeta call received');
    try {
      console.log('ProductMetadataProvider: Try to retrieve productMetadata from DB');
      const product = await this.client.get({
        TableName: this.tableName,
        Key: {
          id,
        }
      }).promise();
      console.log('ProductMetadataProvider: ProductMetadata retrieved successfully');
     return product.Item as ProductMetadata;
    } catch (error)  {
      console.log('ProductMetadataProvider: Error while retrieving productMetadata from DB - ', error);
    }
  }
}