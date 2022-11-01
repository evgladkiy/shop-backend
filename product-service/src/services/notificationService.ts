import { SNSClient, PublishCommand  } from '@aws-sdk/client-sns';
import { DEPLOY_REGION } from 'src/constants';

export class NotificationService {
  private readonly client = new SNSClient({ region: DEPLOY_REGION });
  private readonly arn = process.env.SNS_TOPIC_ARN;

  async notify(params: any): Promise<void> {
    console.log('NotificationService: Notify call received');
    const { message, subject } = params;

    try {
      console.log('NotificationService: Send notification to Admin');
      await this.client.send(new PublishCommand({
        Subject: subject,
        TopicArn: this.arn,
        Message: message,
      }));
      console.log('NotificationService: Notification sent successfully');
    } catch (error) {
      console.log('NotificationService: Error while sending notification ', error);
    }
  }
}