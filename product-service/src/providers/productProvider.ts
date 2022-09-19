import { v4 as uuidv4 } from 'uuid';
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
      console.log('ProductsProvider: GetProducts call completed');

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

      console.log('ProductsProvider: GetProduct call completed');
      return this.mergeProductData(metadata, stock);
    } catch (error)  {
      console.log('ProductsProvider: Error while retrieving product from DB - ', error);
    }
  }

  async createProduct(product: Product): Promise<Product> {
    console.log('ProductsProvider: CreateProduct call received');
    try {
      const newProduct = {
        ...product,
        id: uuidv4()
      };
      const { count, ...meta } = newProduct;

      await this.metadataProvider.createProductMetadata(meta);
      await this.stockProvider.createProductStock({
        count,
        id: product.id
      });
      console.log('ProductsProvider: CreateProduct call completed');

      return newProduct;
    } catch (error)  {
      console.log('ProductsProvider: Error while creating product in DB - ', error);
    }
  }

  private mergeProductData(meta: ProductMetadata, stock: ProductStock): Product {
    return {
      ...meta,
      count: stock ? stock.count : null
    };
  }
}