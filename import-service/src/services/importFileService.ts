import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { 
  DEPLOY_REGION,
  PARSED_FOLDER_NAME,
  UPLOADED_FOLDER_NAME,
  UPLOAD_S3_BUCKET_NAME
} from 'src/constants';
import { ParserFileService } from './parserFileService';
import { Product } from 'src/models';

export class ImportFileService {
  private readonly bucketName = UPLOAD_S3_BUCKET_NAME;
  private readonly uploadedFolderName = UPLOADED_FOLDER_NAME;
  private readonly parseFolderName = PARSED_FOLDER_NAME;
  private readonly s3Client = new S3Client({ region: DEPLOY_REGION });
  private readonly fileParser = new ParserFileService();

  async getUploadUrl(fileName: string): Promise<string> {
    console.log('ImportFileService: GetUploadUrl call received');
    try {
      console.log('ImportFileService: Try to create signed url via S3-client');
      const putObjectParams = {
          Bucket: this.bucketName,
          Key: `${this.uploadedFolderName}/${fileName}`,
      };
  
      const params = new PutObjectCommand(putObjectParams);
      const url = await getSignedUrl(this.s3Client, params);
      console.log('ImportFileService: Signed url created successfully');
      return url;
    } catch(error) {
      console.log('ImportFileService: Error while creating signed url via S3-client - ', error);
    }
  }

  public async parseUploadedFile(fileName: string): Promise<Array<Product>> {
    console.log('ImportFileService: ParseUploadedFile call received');
    console.log('ImportFileService: Try to read uploaded file from storage');
    const getObjectParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new GetObjectCommand(getObjectParams);

    const response = await this.s3Client.send(command);
    const fileStream = response.Body as Readable | null;

    if (!fileStream) {
      console.log(`ImportFileService: Cannot find file - ${fileName}`);
      return Promise.reject(`Cannot find file - ${fileName}`);
    } 
  
    const parsedProducts: Array<Product> = await this.fileParser.parseStream(fileStream);
    console.log('ImportFileService: Uploaded file parsed successfully');
    
    try {
      console.log('ImportFileService: Try to move parsed file to new repository');
      const targetFileName = fileName.replace(this.uploadedFolderName, this.parseFolderName);
      await this.copyFile(fileName, targetFileName);
      await this.deleteFile(fileName);
    } catch (error) {
      console.log('ImportFileService: Error while moving file to new repository');
    }

    return parsedProducts;
  }

  private async copyFile(name: string, targetName: string): Promise<void> {
    console.log(`ImportFileService: Try to copy file from ${name} to ${targetName}`);
    try {
      const copyObjectParams = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${name}`,
        Key: targetName,
      };
      const command = new CopyObjectCommand(copyObjectParams);
      await this.s3Client.send(command);
      console.log(`ImportFileService: File copied successfully from  ${name} to ${targetName}`);
    } catch (error) {
      console.log(`ImportFileService: Error while coping file from  ${name} to ${targetName}`, error);
    }
  }

  private async deleteFile(name: string): Promise<void> {
    console.log(`ImportFileService: Try to delete file ${name}`);
    try {
      const deleteObjectParams = {
        Bucket: this.bucketName,
        Key: name,
      };
      const command = new DeleteObjectCommand(deleteObjectParams);
      await this.s3Client.send(command);
      console.log(`ImportFileService: File ${name} deleted successfully`);
    } catch(error) {
      console.log(`ImportFileService: Error while deleting file ${name}`);
    }
  }
}