import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTodo, deleteTodo } from '../../businessLogic/todo'
import { getUserId } from '../utils'

const deleteTodoLogger = createLogger('deleteToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  deleteTodoLogger.info('Processing delete todo event: ', event)

  // TODO: Remove a TODO item by id
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  const getTodoItem = await getTodo(userId, todoId)
  deleteTodoLogger.info('getTodoItem', getTodoItem)

  const { createdAt } = getTodoItem[0]

  const deleteTodoItem = await deleteTodo(userId, createdAt)
  deleteTodoLogger.info('deleteTodoItem', deleteTodoItem)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
