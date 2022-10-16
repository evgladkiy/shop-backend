import { SQSEvent } from 'aws-lambda';

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('CatalogBatchProcess Lambda: Function execution is stated with event - ', JSON.stringify(event));
  event.Records.map(( record ) => console.log(record));
};

export const main = catalogBatchProcess;
