import { Router } from 'express';

import { createTodo, removeTodo } from '../controllers/todo.controller';
import { isAuthenticated, isSignedIn } from '../controllers/auth.controller';
import { getUserById } from '../controllers/user.controller';

const router = Router();

router.param('userId', getUserById);

/**
 * @method POST
 * @route /api/todo/create/:userId
 * @description create a todo
 * @access private
 */
router.post('/create/:userId', isSignedIn, isAuthenticated, createTodo);

/**
 * @method deleted
 * @route /api/todo/remove/:userId/:todoId
 */
router.delete('/remove/:userId/:todoId', isSignedIn, isAuthenticated, removeTodo);

export default router;
