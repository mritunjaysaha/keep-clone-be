import { Router } from 'express';
import { getUserById } from '../../controllers/user.controller';
import {
    createOrUpdateTodo,
    getAllTodoByUserId,
    getTodo,
    getTodoById,
    removeTodo,
} from '../../controllers/todo.controller';
import { isAuthenticated, isSignedIn } from '../../controllers/auth.controller';

const router = Router();

router.param('userId', getUserById);
router.param('todoId', getTodoById);

/**
 * @method GET
 * @route /api/v1/todos/:userId/all
 */
router.get('/all/:userId', isSignedIn, isAuthenticated, getAllTodoByUserId);

/**
 * @method POST
 * @route /api/v1/todos/:userId
 * @description create or update a todo
 * @access private
 */
router.post('/:userId/:todoId', isSignedIn, isAuthenticated, createOrUpdateTodo);

/**
 * @method GET
 * @route /api/v1/todos/:userId/:todoId
 * @description get todo by todoId
 * @access private
 */
router.get('/:userId/:todoId', isSignedIn, isAuthenticated, getTodo);

/**
 * @method DELETE
 * @route /api/v1/todos/remove/:userId/:todoId
 */
router.delete('/:userId/:todoId', isSignedIn, isAuthenticated, removeTodo);

export default router;
