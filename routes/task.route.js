import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.delete('/:id', authMiddleware, deleteTask);
router.put('/:id', authMiddleware, updateTask);

export default router;