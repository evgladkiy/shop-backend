import { APIGatewayAuthorizerResult } from "aws-lambda/trigger/api-gateway-authorizer";

export const generateAPiGatewayPolicy = (
  principalId: string,
  resource: string,
  effect: string
): APIGatewayAuthorizerResult => ({
  principalId: principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
