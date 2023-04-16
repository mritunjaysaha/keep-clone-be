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
router.param('labelId', getLabelById);
router.param('todoId', getTodoById);

/**
 * @method POST
 * @route /api/v1/label/:userId
 */
router.post('/:userId', isSignedIn, isAuthenticated, createLabel);

/**
 * @method GET
 * @router /api/v1/label/all/:userId
 */
router.get('/:userId/all', isSignedIn, isAuthenticated, getAllLabelByUserId);

/**
 * @method GET
 * @route /api/v1/label/:userId/:labelId
 */
router.get('/:userId/:labelId', isSignedIn, isAuthenticated, getLabel);

/**
 * @method DELETE
 * @route /api/v1/label/:userId/:labelId
 */
router.delete('/:userId/:labelId', isSignedIn, isAuthenticated, removeLabel);

/**
 * @method GET
 * @route /api/v1/label/all/:userId/:labelId
 */
router.get('/:userId/:labelId', isSignedIn, isAuthenticated, getAllTodoByLabelId);

/**
 * @method PUT
 * @route /api/v1/labels/:userId/:labelId
 */

/**
 * @method PUT
 * @route /api/v1/label/:userId/:labelId/:todoId
 */
router.put('/:userId/:labelId/:todoId', isSignedIn, isAuthenticated, putTodoToALabel);

export default router;
