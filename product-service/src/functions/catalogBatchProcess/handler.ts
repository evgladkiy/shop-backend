import { SQSEvent } from 'aws-lambda';
import { HttpResponse } from 'src/helpers';
import { Product } from 'src/models/product.model';
import { ProductProvider } from 'src/providers';

const productsProvider = new ProductProvider();

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('CatalogBatchProcess Lambda: Function execution is stated with event - ', JSON.stringify(event));
  
  try {
    console.log('CatalogBatchProcess Lambda: Try to populate DB with Products');
    const records = event.Records;
    for (let record of records) {
      const product: Product = JSON.parse(record.body);
      const dbProduct = await productsProvider.createProduct(product);
      console.log('CatalogBatchProcess Lambda: Product Added to DB - ', JSON.stringify(dbProduct));
    }
    console.log('CatalogBatchProcess Lambda: DB populated successfully' );
  } catch (error) {
    console.log('CatalogBatchProcess Lambda: Try to populate DB with Products');
    return HttpResponse.serverError({
      error: 'Server Error',
      request: event
    });
  }
};

export const main = catalogBatchProcess;
