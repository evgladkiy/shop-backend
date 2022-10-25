import { SQSClient, SendMessageBatchCommand, SendMessageBatchRequestEntry, SendMessageBatchCommandOutput } from '@aws-sdk/client-sqs';
import { DEPLOY_REGION } from 'src/constants';

export class QueueMessageService {
  private readonly batchMessagesNumber = 5;
  private readonly client = new SQSClient({ region: DEPLOY_REGION });
  private readonly queueUrl = process.env.PRODUCTS_QUEUE_URL;

  async sendMessages<T>(params: Array<T & { id : string }>): Promise<void> {
    console.log('QueueMessageService: SendMessages call received');
    try {
      const batchEntities: Array<SendMessageBatchRequestEntry> = params.map((x) => ({
        Id: x.id as string,
        MessageBody: JSON.stringify(x),
      }));
      console.log('QueueMessageService: Try to split messages to batches');
      const batchMessages = this.createBatchMessages(batchEntities);

      for (let message of batchMessages) {
        await this.sendMessage(message);
      }
      console.log('QueueMessageService: Messages sent successfully');
    } catch(error) {
      console.log('QueueMessageService: Error while sending messages signed to Queue - ', error);
    }
  }

  private async sendMessage(message: Array<SendMessageBatchRequestEntry>): Promise<SendMessageBatchCommandOutput> {
    const command = new SendMessageBatchCommand({
      QueueUrl: this.queueUrl,
      Entries: message,
    });
    console.log('QueueMessageService: Try to send batch to queue, -', command);
    const result = await this.client.send(command);

    return result;
  }

  private createBatchMessages(batches: Array<SendMessageBatchRequestEntry>): Array<Array<SendMessageBatchRequestEntry>> {
    const result: Array<Array<SendMessageBatchRequestEntry>> = [];

    for (let i = 0; i < batches.length; i += this.batchMessagesNumber) {
      const batch = batches.slice(i, i + this.batchMessagesNumber);
      result.push(batch);
    }

    return result;
  }
}