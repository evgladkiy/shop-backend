
import { APIGatewayTokenAuthorizerHandler, APIGatewayTokenAuthorizerEvent, Context, Callback, APIGatewayAuthorizerResult } from 'aws-lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler =
  (event: APIGatewayTokenAuthorizerEvent, cxt: Context, cb: Callback<APIGatewayAuthorizerResult>): void => {

  if (event.type !== 'TOKEN') {
    cb('error');
    return 
  }

  try {
    const token = event.authorizationToken;
    const encodedCredentials = token.split(' ')[1] || '';
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const credentials = buffer.toString().split(':');
    const userName = credentials[0];
    const userPassword = credentials[1];

    const storagePassword = process.env[userName];

    const effect = !storagePassword || storagePassword !== userPassword ? 'Deny' : 'Allow'
    const policy = generatePolicy(encodedCredentials, event.methodArn, effect)
    cb(null, policy)

  } catch(error) {
    cb(error.message)
  }
};

const generatePolicy = (principalId: string, resource: string, effect = 'Allow'): APIGatewayAuthorizerResult => ({
  principalId: principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  }
})

export const main = basicAuthorizer;
