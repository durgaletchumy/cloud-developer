import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodo, updateTodo } from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const updateTodoLogger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  updateTodoLogger.info('Processing update todo event: ', event)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const getTodoItem = await getTodo(userId, todoId)
  updateTodoLogger.info('getTodoItem', getTodoItem)

  const { createdAt } = getTodoItem[0]

  const updateTodoItem = await updateTodo(userId, createdAt, updatedTodo)
  updateTodoLogger.info('updateTodoItem', updateTodoItem)

  return ({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  })
}
