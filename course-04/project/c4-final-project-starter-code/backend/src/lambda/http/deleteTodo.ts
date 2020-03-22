import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteToDo')

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing delete todo event: ', event)

  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  await docClient.delete({
    TableName: todoTable,
    Key:{
      "todoId": todoId
    }
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
