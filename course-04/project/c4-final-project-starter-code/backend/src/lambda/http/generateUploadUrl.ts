import 'source-map-support/register'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodo, getUploadUrl, createTodoImage } from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const generateUrlLogger = createLogger('generateUploadURL')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  generateUrlLogger.info('Processing generateUpload URL event: ', event)
  const todoId = event.pathParameters.todoId

  const imageId = uuid.v4()
  await createImage(todoId, imageId, event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const url = await getUploadUrl(imageId)
  generateUrlLogger.info('Upload URL: ', url)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

async function createImage(todoId: string, imageId: string, event: any) {
  generateUrlLogger.info('createImage is invoked')

  const userId = getUserId(event)
  const getTodoItem = await getTodo(userId, todoId)
  
  generateUrlLogger.info('getTodoItem', getTodoItem)

  const { createdAt } = getTodoItem[0]

  const newItem = await createTodoImage(userId, createdAt, imageId)

  return newItem
}

