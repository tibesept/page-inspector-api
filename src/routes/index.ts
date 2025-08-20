import { Router } from 'express';
import botRoutes from './bot';
import workerRoutes from './worker';
import { authMiddleware } from '../middlewares/auth';
import { config } from '../config';

const router = Router();

router.use('/bot', authMiddleware([config.bot_auth_token]), botRoutes);
router.use('/worker', authMiddleware([config.worker_auth_token]), workerRoutes);

export default router;