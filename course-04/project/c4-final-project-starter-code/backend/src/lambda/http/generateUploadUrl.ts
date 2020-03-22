import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadURL')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.TODO_IMAGES_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generateUpload URL event: ', event)
  const todoId = event.pathParameters.todoId

  const imageId = uuid.v4()
  const newItem = await createImage(todoId, imageId, event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const url = getUploadUrl(imageId)

  logger.info('Upload URL: ', url)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

async function createImage(todoId: string, imageId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newImage = JSON.parse(event.body)

  const newItem = {
    todoId,
    timestamp,
    imageId,
    ...newImage,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem
    })
    .promise()

  await docClient.update({
    TableName: todoTable,
    Key:{
      "todoId": todoId
    },
    UpdateExpression: "set attachmentUrl=:attachmentUrl",
    ExpressionAttributeValues:{
      ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${imageId}`
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  return newItem
}

function getUploadUrl (imageId: string) {
  return s3.getSignedUrl( 'putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
