import csv from 'csv-parser';
import { Readable } from 'stream';

// handle parsing uploaded csv files
export class ParserFileService {
  parseStream<T>(stream: Readable): Promise<T[]> {
    console.log('ParserFileService: ParseStream call received');
    const parsedData: T[] = [];
    return new Promise((resolve, reject) => {
      stream.pipe(csv())
        .on('error', (error) => {
          console.log(`ParserFileService: Error while parsing scv file - ${JSON.stringify(error)}`);
          return reject(error)}
        )
        .on('data', (item: T) => parsedData.push(item))
        .on('end', () => {
          console.log(`ParserFileService: SCV-file parsed successfully`);
          return resolve(parsedData)
        });
    });
  }
}