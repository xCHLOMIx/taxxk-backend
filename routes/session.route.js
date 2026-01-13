import express from 'express';
import { createSession, endSession, startSession, deleteSession, fetchUserSessions } from '../controllers/session.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSession);
router.get('/', authMiddleware, fetchUserSessions);
router.post('/start/:id', authMiddleware, startSession);
router.post('/end/:id', authMiddleware, endSession);
router.delete('/:id', authMiddleware, deleteSession);

export default router;