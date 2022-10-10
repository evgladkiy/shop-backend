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

  async createProductMetadata(meta: ProductMetadata): Promise<void> {
    console.log('ProductMetadataProvider: CreateProductMetadata call received');
    try {
      console.log('ProductMetadataProvider: Try to create productMetadata in DB');
      await this.client.put({
        TableName: this.tableName,
        Item: {
          id: meta.id || '',
          title: meta.title || '',
          description: meta.description || '',
          price: meta.price || 0,
          weight: meta.weight || 0,
          img: meta.img || ''
        },
      }).promise();
      console.log('ProductMetadataProvider: ProductMetadata created successfully');
     return null;
    } catch (error)  {
      console.log('ProductMetadataProvider: Error while creating productMetadata in DB - ', error);
    }
  }

  async deleteProductMetadata(id: string): Promise<void> {
    console.log('ProductMetadataProvider: DeleteProductMetadata call received');
    try {
      console.log('ProductMetadataProvider: Try to delete productMetadata in DB');
      await this.client.delete({
        TableName: this.tableName,
        Key: {
          id,
        }
      }).promise();
      console.log('ProductMetadataProvider: ProductMetadata deleted successfully');
     return null;
    } catch (error)  {
      console.log('ProductMetadataProvider: Error while deleting productMetadata in DB - ', error);
    }
  }
}