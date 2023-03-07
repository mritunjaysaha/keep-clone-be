import { Router } from 'express';

import { createTodo, getAllTodoByUserId, getTodo, getTodoById, removeTodo } from '../controllers/todo.controller';
import { isAuthenticated, isSignedIn } from '../controllers/auth.controller';
import { getUserById } from '../controllers/user.controller';

const router = Router();

router.param('userId', getUserById);
router.param('todoId', getTodoById);

/**
 * @method POST
 * @route /api/todo/create/:userId
 * @description create a todo
 * @access private
 */
router.post('/:userId', isSignedIn, isAuthenticated, createTodo);

/**
 * @method DELETE
 * @route /api/todo/remove/:userId/:todoId
 */
router.delete('/:userId/:todoId', isSignedIn, isAuthenticated, removeTodo);

/**
 * @method GET
 * @route /api/todo/:userId/:todoId
 */
router.get('/:userId/:todoId', isSignedIn, isAuthenticated, getTodo);

/**
 * @method GET
 * @route /api/todo/:userId/all
 */
router.get('/all/:userId', isSignedIn, isAuthenticated, getAllTodoByUserId);

export default router;
