import { Router } from 'express';

import {
    createLabel,
    getLabel,
    getAllLabelByUserId,
    getLabelById,
    removeLabel,
    getAllTodoByLabelId,
    putTodoToALabel,
} from '../../controllers/label.controller';

import { isAuthenticated, isSignedIn } from '../../controllers/auth.controller';

import { getUserById } from '../../controllers/user.controller';
import { getTodoById } from '../../controllers/todo.controller';
import { putLabelName } from '../../controllers/label.controller';

const router = Router();

router.param('userId', getUserById);
router.param('labelId', getLabelById);
router.param('todoId', getTodoById);

/**
 * @method POST
 * @route /api/v1/labels/:userId
 * @access private
 */
router.post('/:userId', isSignedIn, isAuthenticated, createLabel);

/**
 * @method GET
 * @router /api/v1/labels/all/:userId
 * @access private
 */
router.get('/:userId/all', isSignedIn, isAuthenticated, getAllLabelByUserId);

/**
 * @method GET
 * @route /api/v1/labels/:userId/:labelId
 * @access private
 */
router.get('/:userId/:labelId', isSignedIn, isAuthenticated, getLabel);

/**
 * @method PUT
 * @route /api/v1/labels/:userId/:labelId
 */
router.put('/:userId/:labelId', isSignedIn, isAuthenticated, putLabelName);

/**
 * @method DELETE
 * @route /api/v1/labels/:userId/:labelId
 * @access private
 */
router.delete('/:userId/:labelId', isSignedIn, isAuthenticated, removeLabel);

/**
 * @method GET
 * @route /api/v1/labels/all/:userId/:labelId
 */
router.get('/:userId/:labelId/all', isSignedIn, isAuthenticated, getAllTodoByLabelId);

/**
 * @method PUT
 * @route /api/v1/labels/:userId/:labelId/:todoId
 */
router.put('/:userId/:labelId/:todoId', isSignedIn, isAuthenticated, putTodoToALabel);

export default router;
