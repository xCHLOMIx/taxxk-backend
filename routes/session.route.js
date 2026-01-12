import express from 'express';
import { createSession, endSession, startSession } from '../controllers/session.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSession);
router.post('/start/:id', authMiddleware, startSession);
router.post('/end/:id', authMiddleware, endSession);

export default router;