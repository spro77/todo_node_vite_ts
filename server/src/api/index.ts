import { Router } from 'express';
import todoRoutes from './todos.js';

const router = Router();

router.use('/todos', todoRoutes);

export default router;
