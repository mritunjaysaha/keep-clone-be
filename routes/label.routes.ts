import { Router } from 'express';

import {
    createLabel,
    getLabel,
    getAllLabelByUserId,
    getLabelById,
    removeLabel,
    getAllTodoByLabelId,
    putTodoToALabel,
} from '../controllers/label.controller';

import { isAuthenticated, isSignedIn } from '../controllers/auth.controller';

import { getUserById } from '../controllers/user.controller';
import { getTodoById } from '../controllers/todo.controller';

const router = Router();

router.param('userId', getUserById);
router.param('todoId', getLabelById);

/**
 * @method POST
 * @route /api/label/:userId
 */
router.post('/:userId', isSignedIn, isAuthenticated, createLabel);

/**
 * @method GET
 * @route /api/label/:userId
 */
router.post('/:userId', isSignedIn, isAuthenticated, getLabel);

/**
 * @method GET
 * @router /api/label/all/:userId
 */
router.post('/all/:userId', isSignedIn, isAuthenticated, getAllLabelByUserId);

/**
 * @method DELETE
 * @route /api/label/:userId/:labelId
 */
router.delete('/:userId/:labelId', isSignedIn, isAuthenticated, removeLabel);

/**
 * @method GET
 * @route /api/label/all/:userId/:labelId
 */
router.get('/:userId/:labelId', isSignedIn, isAuthenticated, getAllTodoByLabelId);

/**
 * @method PUT
 * @route /api/label/:userId/:labelId/:todoId
 */
router.put('/:userId/:labelId/:todoId', isSignedIn, isAuthenticated, putTodoToALabel);

export default router;
