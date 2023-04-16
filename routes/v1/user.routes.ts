import { Router } from 'express';

import { getUserById, getUser } from '../controllers/user.controller';
import { isAuthenticated, isSignedIn } from '../controllers/auth.controller';

const router = Router();

router.param('userId', getUserById);

/**
 * @method GET
 * @route /api/v1/user/:userId
 * @description get the user info
 * @access private
 */
router.get('/:userId', isSignedIn, isAuthenticated, getUser);

export default router;
