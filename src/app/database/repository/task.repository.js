import { tasksModel } from "../models.js";

export async function createTask({ userId, title, description }) {
  const result = await tasksModel.insertOne({
    userId,
    title: title || "",
    description: description || "",
    createdAt: new Date(),
    isCompleted: false
  });

  if (!result.acknowledged) {
    throw new Error('Failed to create task');
  }

  return {
    id: result.insertedId,
  };
}

export async function isTaskExists({ taskId, userId }) {
  const task = await tasksModel.findOne(
    { _id: taskId, userId: userId },
    { projection: { _id: 1 } }
  )
  return Boolean(task)
}

export async function updateTask({ taskId, title, description, isCompleted }) {
  const setData = {}
  const unSetData = {}
  if (title) setData.title = title
  if (description) setData.description = description
  if (isCompleted != undefined) setData.isCompleted = isCompleted
  if (isCompleted) setData.completedAt = new Date()
  if (isCompleted === false) unSetData.completedAt = ""

  const response = await tasksModel.updateOne(
    { _id: taskId },
    { $set: setData, $unset: unSetData }
  );

  if (!response.acknowledged || response.modifiedCount !== 1) {
    throw new Error('Failed to update task data');
  }
}

export async function getAllTaskList({ userId, skip = 0, limit = 0, descSortByCreatedAt = true }) {
  const sort = { _id: 1 }

  if (descSortByCreatedAt) sort._id = -1

  return await getTaskList(
    { userId },
    { title: 1, description: 1, isCompleted: 1, createdAt: 1, completedAt: 1 },
    skip,
    limit,
    sort
  )
}

export async function getPendingTaskList({ userId, skip = 0, limit = 0, descSortByCreatedAt = true }) {
  const sort = { _id: 1 }

  if (descSortByCreatedAt) sort._id = -1

  return await getTaskList(
    { userId, isCompleted: false },
    { title: 1, description: 1, isCompleted: 1, createdAt: 1 },
    skip,
    limit,
    sort
  )
}

export async function getCompletedTaskList({ userId, skip = 0, limit = 0, descSortByCompletedAt = true }) {
  const sort = { completedAt: 1 }

  if (descSortByCompletedAt) sort.completedAt = -1

  const tasks = await getTaskList(
    { userId, isCompleted: true },
    { title: 1, description: 1, isCompleted: 1, completedAt: 1, createdAt: 1 },
    skip,
    limit,
    sort
  )
  return tasks
}

async function getTaskList(query, projection = {}, skip, limit, sort) {
  const data = await tasksModel
    .find(
      query,
      { projection: projection }
    )
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray()

  return data
}

export async function deleteTask({ taskId }) {
  const response = await tasksModel.deleteOne({ _id: taskId })
  if (!response.acknowledged || response.deletedCount !== 1) {
    throw new Error('Failed to delete task data');
  }
}
