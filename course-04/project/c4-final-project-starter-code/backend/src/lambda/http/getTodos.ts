import 'source-map-support/register'
import { parseUserId } from '../../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodo')
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing get todo event: ', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)

  const result = await docClient.scan({
    TableName: todoTable,
    FilterExpression:'userId = :userId',
    // KeyConditionExpression: 'todoId and userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  logger.info('Result from GetToDo: ', result)

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
