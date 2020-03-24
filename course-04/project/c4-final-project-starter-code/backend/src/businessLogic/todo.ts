import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'

const businessLogicLogger = createLogger('businessLogicLogger')

const todoAccess = new TodoAccess()

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  businessLogicLogger.info('invoke createTodo business Logic')

  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  })
}

export async function getTodo(userId: string, todoId:string) {
  businessLogicLogger.info('invoke getTodo business Logic')

  return await todoAccess.getTodo(userId, todoId)
}

export async function updateTodo(userId: string, createdAt:string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
  businessLogicLogger.info('invoke updateTodo business Logic')

  return await todoAccess.updateTodo(userId, createdAt, updateTodoRequest)
}

export async function deleteTodo(userId:string, createdAt:string) {
  businessLogicLogger.info('invoke deleteTodo business Logic')

  return await todoAccess.deleteTodo(userId, createdAt)
}

export async function createTodoImage(userId:string, createdAt:string, imageId:string){
  businessLogicLogger.info('invoke create todo image business logic')

  return await todoAccess.createTodoImage(userId, createdAt, imageId)
}

export async function getUploadUrl(imageId:string) {
  businessLogicLogger.info('invoke generate upload URL business logic')

  return await todoAccess.getUploadUrl(imageId)
}