import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const createTodoLogger = createLogger('createTodoLogger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createTodoLogger.info('Processing create to do: ', event)
  
  // TODO: Implement creating a new TODO item
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  createTodoLogger.info('newToDo', newTodo)

  const userId = getUserId(event)

  const newTodoItem = await createTodo(newTodo, userId)

  createTodoLogger.info('newTodoItem', newTodoItem)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newTodoItem
    })
  }
}
