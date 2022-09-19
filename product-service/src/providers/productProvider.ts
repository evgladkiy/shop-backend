import { Product, ProductMetadata } from '../models';
import { ProductMetadataProvider } from './productMetadataProvider';
import { ProductStockProvider } from './productStockProvider';
import { ProductStock } from '../models/productStock.model';

/**
 * Handle all communication with the Products
 */
 export class ProductProvider {
  private metadataProvider =  new ProductMetadataProvider();
  private stockProvider = new ProductStockProvider();

  async getProducts(): Promise<Array<Product>> {
    console.log('ProductsProvider: GetProducts call received');
    try {
      const metadata = await this.metadataProvider.getProductsMeta();
      const stocks = await this.stockProvider.getStocks();
      const products = [];

      if (metadata && metadata.length) {
        metadata.forEach(meta => {
          const productStock = stocks.find(stock => stock.id === meta.id);
          const product = this.mergeProductData(meta, productStock);

          products.push(product);
        });
      }
      return products;
    } catch (error)  {
      console.log('ProductsProvider: Error while retrieving products from DB - ', error);
    }
  }

  async getProduct(id: string): Promise<Product> {
    console.log('ProductsProvider: GetProduct call received');
    try {
      const metadata = await this.metadataProvider.getProductMeta(id);
      const stock = await this.stockProvider.getProductStock(id);

      return this.mergeProductData(metadata, stock);
    } catch (error)  {
      console.log('ProductsProvider: Error while retrieving product from DB - ', error);
    }
  }

  private mergeProductData(meta: ProductMetadata, stock: ProductStock): Product {
    return {
      ...meta,
      count: stock ? stock.count : null
    };
  }
}