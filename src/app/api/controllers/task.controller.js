import {
  booleanSchema,
  fixedStringSchema,
  numberSchema,
  objectId,
  objectIdSchema,
  objectSchema,
  stringSchema,
  validateObject,
} from '../../utils/index.js';
import { BadRequestError } from '../../errors/index.js';
import { taskService } from '../../services/index.js';

const createTaskSchema = objectSchema({
  object: {
    title: stringSchema({ min: 3, max: 20 }),
    description: stringSchema({ required: false, max: 100 }),
  },
});

const deleteTaskSchema = objectSchema({
  object: {
    taskId: objectIdSchema(),
  }
});

const updateTaskSchema = objectSchema({
  object: {
    taskId: objectIdSchema(),
    title: stringSchema({ min: 3, max: 20, required: false }),
    description: stringSchema({ required: false, max: 100 }),
    isCompleted: booleanSchema(false)
  }
});

const getTasksSchema = objectSchema({
  object: {
    type: fixedStringSchema({ values: ['all', 'completed', 'pending'], required: false }),
    skip: numberSchema({ required: false, min: 0 }),
    limit: numberSchema({ required: false, min: 0 }),
    descSortByCreatedAt: booleanSchema(false),
    descSortByCompletedAt: booleanSchema(false)
  }
});

export async function createTask(req, res, next) {
  try {
    const { error, value } = validateObject(createTaskSchema, req.body);

    if (error) throw new BadRequestError(error.message);

    const { title, description } = value;
    const { userId } = req.user
    const result = await taskService.createTask({ description, title, userId });

    res.json(result);

  } catch (error) {
    next(error)
  }
}


export async function deleteTask(req, res, next) {
  try {
    // Validate the request parameters
    const { error, value } = validateObject(deleteTaskSchema, { ...req.params });

    console.log(value)
    if (error) throw new BadRequestError(error.message);


    const { taskId } = value;
    const { userId } = req.user;

    await taskService.deleteTask({ taskId: objectId(taskId), userId });

    res.json({message: "Task deleted successfully"})
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { error, value } = validateObject(updateTaskSchema, { ...req.body, ...req.params });

    if (error) throw new BadRequestError(error.message);

    const { taskId, title, description, isCompleted } = value;
    const { userId } = req.user;

    await taskService.updateTask({ taskId: objectId(taskId), userId, description, isCompleted, title });

    res.json({message: "Task updated successfully"})
    
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    // Validate the request parameters
    const { error, value } = validateObject(getTasksSchema, { ...req.query });

    if (error) throw new BadRequestError(error.message);

    const {
      type,
      descSortByCompletedAt,
      descSortByCreatedAt,
      limit,
      skip
    } = value;
    const { userId } = req.user;

    const result = await taskService.getTaskList({
      userId,
      descSortByCompletedAt,
      descSortByCreatedAt,
      limit: limit || 0,
      skip: skip || 0,
      type: type || 'all'
    });

    res.json(result)
  } catch (error) {
    next(error);
  }
}