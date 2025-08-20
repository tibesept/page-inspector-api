import { Router } from 'express';
import userRoutes from './job';
import jobRoutes from './user';

const router = Router();

router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);

export default router;