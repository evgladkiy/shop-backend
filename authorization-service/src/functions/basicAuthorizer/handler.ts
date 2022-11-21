import {
  APIGatewayTokenAuthorizerHandler,
  APIGatewayTokenAuthorizerEvent,
  Context,
  Callback,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { generateAPiGatewayPolicy } from "src/helpers";

const TOKEN_EVENT_TYPE = 'TOKEN';
const CREDENTIALS_SEPARATOR = ':'
const DENY_POLICY_EFFECT = 'Deny';
const ALLOW_POLICY_EFFECT = 'Allow';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (
  event: APIGatewayTokenAuthorizerEvent,
  cxt: Context,
  cb: Callback<APIGatewayAuthorizerResult>
): void => {
  console.log('BasicAuthorizer Lambda: Function execution is stated with event - ', JSON.stringify(event));
  console.log('BasicAuthorizer Lambda: Try to check event.type - ', event.type);
  if (event.type !== TOKEN_EVENT_TYPE) {
    console.log('BasicAuthorizer Lambda: Event type is incorrect - ', event.type);
    cb('Invalid event type');
    return;
  }

  console.log('BasicAuthorizer Lambda: Event type is ok, try to parse token', event.authorizationToken);

  try {
    const token = event.authorizationToken;
    const encodedCredentials = token.split(" ")[1] || "";
    const buffer = Buffer.from(encodedCredentials, "base64");
    const credentials = buffer.toString().split(CREDENTIALS_SEPARATOR);
    const userName = credentials[0];
    const userPassword = credentials[1];
    console.log(`BasicAuthorizer Lambda: User name is '${userName}', user password is '${userPassword}'`);

    const storagePassword = process.env[userName];

    let effect = ALLOW_POLICY_EFFECT;

    if (!storagePassword) {
      effect = DENY_POLICY_EFFECT;
      console.log('BasicAuthorizer Lambda: Cannot find secret password, please check env variables.');
    }

    if (storagePassword && storagePassword !== userPassword) {
      effect = DENY_POLICY_EFFECT;
      console.log('BasicAuthorizer Lambda: Passwords do not match.');
    }

    const policy = generateAPiGatewayPolicy(
      encodedCredentials,
      event.methodArn,
      effect
    );
    console.log('BasicAuthorizer Lambda: Generated policy - ', JSON.stringify(event));
    cb(null, policy);
  } catch (error) {
    console.log('BasicAuthorizer Lambda: Error while parsing credentials');
    cb('Unauthorized');
  }
};

export const main = basicAuthorizer;
