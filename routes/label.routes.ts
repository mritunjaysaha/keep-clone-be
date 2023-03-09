import { Router } from 'express';

import { createLabel, getLabel, getAllLabelByUserId, getLabelById } from '../controllers/label.controller';

import { isAuthenticated, isSignedIn } from '../controllers/auth.controller';

import { getUserById } from '../controllers/user.controller';
import { getTodoById } from '../controllers/todo.controller';

const router = Router();

router.param('userId', getUserById);
router.param('todoId', getTodoById);

/**
 * @method POST
 * @route /api/label/:userId
 */
router.post('/:userId', isSignedIn, isAuthenticated, createLabel);

export default router;
