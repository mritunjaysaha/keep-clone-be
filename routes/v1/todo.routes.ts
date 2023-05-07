import { Router } from 'express';
import { getUserById } from '../../controllers/user.controller';
import {
    createTodo,
    getAllTodoByUserId,
    getTodo,
    getTodoById,
    removeTodo,
    updateTodo,
} from '../../controllers/todo.controller';
import { isAuthenticated, isSignedIn } from '../../controllers/auth.controller';

const router = Router();

router.param('userId', getUserById);
router.param('todoId', getTodoById);

/**
 * @method POST
 * @route /api/v1/todos/:userId
 * @description create a todo
 * @access private
 */
router.post('/:userId', isSignedIn, isAuthenticated, createTodo);

/**
 * @method GET
 * @route /api/v1/todos/:userId/all
 */
router.get('/all/:userId', isSignedIn, isAuthenticated, getAllTodoByUserId);

/**
 * @method GET
 * @route /api/v1/todos/:userId/:todoId
 * @description get todo by todoId
 * @access private
 */
router.get('/:userId/:todoId', isSignedIn, isAuthenticated, getTodo);

/**
 * @method PUT
 * @route /api/v1/todos/:userId/:todoId
 * @description update todo by todoId
 * @access private
 */
router.patch('/:userId/:todoId', isSignedIn, isAuthenticated, updateTodo);

/**
 * @method DELETE
 * @route /api/v1/todos/remove/:userId/:todoId
 */
router.delete('/:userId/:todoId', isSignedIn, isAuthenticated, removeTodo);

export default router;
