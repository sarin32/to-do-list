import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from '../controllers/task.controller.js';
import { tokenMiddleware } from "../middlewares/token.middleware.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";

const verifiedUserAuthMiddleware = authorizationMiddleware()

const router = Router()

router.use(tokenMiddleware, verifiedUserAuthMiddleware)

router.get('/', getTasks)

router.delete('/:taskId', deleteTask)

router.post('/', createTask)

router.patch('/:taskId', updateTask)

export default router;
