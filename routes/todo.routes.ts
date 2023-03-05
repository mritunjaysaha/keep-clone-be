import { Router } from 'express';

import { createTodo } from '../controllers/todo.controller';
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

export default router;
