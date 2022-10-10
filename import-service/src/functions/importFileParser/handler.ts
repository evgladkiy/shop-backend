import { S3Event, S3Handler } from 'aws-lambda'
import { Product } from 'src/models';
import { ImportFileService } from 'src/services';

const importFileService = new ImportFileService();

const importProductsParser: S3Handler = async (event: S3Event) => {
  console.log('ImportProductsParser Lambda: Function execution is stated with event - ', JSON.stringify(event));
  try {
    console.log('ImportProductsParser Lambda: Try to parse uploaded file - ', JSON.stringify(event));
    const record = event.Records[0];
    const fileName = record.s3.object.key;
    const result: Array<Product> = await importFileService.parseUploadedFile(fileName);
    console.log('ImportProductsParser Lambda: Uploaded file parsed successfully - ', JSON.stringify(result));
  } catch (error) {
    console.log('ImportProductsParser Lambda: Error while parsing uploaded file - ', JSON.stringify(error));
  }
};

export const main = importProductsParser;
