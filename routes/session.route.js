import express from 'express';
import { createSession } from '../controllers/session.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSession);
router.post('/start/:id', authMiddleware, createSession);

export default router;