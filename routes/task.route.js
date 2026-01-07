import express from 'express';
import { createTask, deleteTask, getTasks } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.delete('/:id', authMiddleware, deleteTask);

export default router;