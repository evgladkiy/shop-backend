import { SQSEvent } from 'aws-lambda';
import { HttpResponse } from 'src/helpers';
import { Product } from 'src/models/product.model';
import { ProductProvider } from 'src/providers';
import { NotificationService } from 'src/services/notificationService';

const productsProvider = new ProductProvider();
const notificationService = new NotificationService();

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('CatalogBatchProcess Lambda: Function execution is stated with event - ', JSON.stringify(event));
  
  try {
    console.log('CatalogBatchProcess Lambda: Try to populate DB with Products');
    const records = event.Records;
    for (let record of records) {
      const product: Product = JSON.parse(record.body);
      const dbProduct = await productsProvider.createProduct(product);
      console.log('CatalogBatchProcess Lambda: Product Added to DB - ', JSON.stringify(dbProduct));
      console.log('CatalogBatchProcess Lambda: Send notification');
      notificationService.notify({
        subject: 'Product Added to Database',
        message: JSON.stringify(product),
      });
    }
    console.log('CatalogBatchProcess Lambda: DB populated successfully' );
  } catch (error) {
    console.log('CatalogBatchProcess Lambda: Error while populating DB with Products');
    notificationService.notify({
      subject: 'Error while populating DB with Products',
      message: JSON.stringify(error),
    });
    return HttpResponse.serverError({
      error: 'Server Error',
      request: event
    });
  }
};

export const main = catalogBatchProcess;
