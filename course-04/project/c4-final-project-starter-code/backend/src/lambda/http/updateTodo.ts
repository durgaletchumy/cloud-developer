import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing update todo event: ', event)

  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  await docClient.update({
    TableName: todoTable,
    Key:{
      "todoId": todoId
    },
    UpdateExpression: "set #n=:name, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues:{
      ":name": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
    },
    ExpressionAttributeNames:{
      "#n": "name"
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  return ({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  })
}
