import { Router } from 'express';
import userRouter from './user.route.js';
import taskRouter from './task.route.js';


const router = Router();

// extend routes here
router.use('/user', userRouter);
router.use('/task', taskRouter);


export default router;
