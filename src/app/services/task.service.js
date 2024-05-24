import { taskRepository } from "../database/index.js";
import { NotFoundError } from "../errors/index.js";

export async function createTask({ userId, title, description }) {
  return await taskRepository.createTask({ description, title, userId })
}

export async function updateTask({ taskId, userId, title, description, isCompleted }) {
  const isTaskExist = await taskRepository.isTaskExists({ taskId, userId })

  if (!isTaskExist) throw new NotFoundError('Task not found')

  return await taskRepository.updateTask({ description, isCompleted, taskId, title })
}


export async function getTaskList({
  type = 'all',
  userId,
  skip = 0,
  limit = 0,
  descSortByCreatedAt = true,
  descSortByCompletedAt = true
}) {
  if (type == 'pending') {
    return await taskRepository.getPendingTaskList({ userId, descSortByCreatedAt, limit, skip })
  }
  if (type == 'completed') {
    return await taskRepository.getCompletedTaskList({ userId, descSortByCompletedAt, limit, skip })
  }
  return await taskRepository.getAllTaskList({ userId, descSortByCreatedAt, limit, skip })
}

export async function deleteTask({ taskId, userId }) {
  const isTaskExist = await taskRepository.isTaskExists({ taskId, userId })

  if (!isTaskExist) throw new NotFoundError('Task not found')

  return await taskRepository.deleteTask({ taskId })
}