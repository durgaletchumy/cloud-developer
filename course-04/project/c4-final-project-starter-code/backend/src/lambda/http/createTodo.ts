import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { parseUserId } from '../../auth/utils'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'

const logger = createLogger('createToDo')

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing create to do: ', event)
  // const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item

  const parsedBody = JSON.parse(event.body)
  const todoId = uuid.v4()
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newToDo =  {
    todoId: todoId,
    userId: parseUserId(jwtToken),
    createdAt: new Date().toISOString(),
    done: false,
    ...parsedBody
  }

  logger.info('newToDo', newToDo)

  await docClient.put({
    TableName: todoTable,
    Item: newToDo
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newToDo
    })
  }
}
