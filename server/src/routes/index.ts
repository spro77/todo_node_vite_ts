import { Router } from 'express';
import { 
  getAllTodos, 
  getTodosByUserId, 
  getTodosByUserEmail, 
  createTodo, 
  deleteTodo 
} from '../controllers/todoController.js';
import { signup, login } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth routes
router.post('/users/signup', signup);
router.post('/users/login', login);

// Protected todo routes
router.get('/todos', authenticateToken, getAllTodos);
router.get('/todos/user/id/:id', authenticateToken, getTodosByUserId);
router.get('/todos/user/email/:email', authenticateToken, getTodosByUserEmail);
router.post('/todos', authenticateToken, createTodo);
router.delete('/todos/:id', authenticateToken, deleteTodo);

export default router;
