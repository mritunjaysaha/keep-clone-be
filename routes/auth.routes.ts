import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import { signup, login, signOut, isSignedIn } from '../controllers/auth.controller';

const router = Router();

/**
 * @method POST
 * @route /api/auth/signup
 */
router.post(
    '/signup',
    [
        check('firstName', 'First name should be at least 1 character').isLength({ min: 1 }),
        check('email', 'E-mail is required').isEmail(),
        check('password', 'Password should have at least 3 characters').isLength({ min: 3 }),
    ],
    signup,
);

/**
 * @method POST
 * @route /api/auth/login
 */
router.post(
    '/login',
    [check('email', 'E-mail is required').isEmail(), check('password', 'Password is require').isLength({ min: 1 })],
    login,
);

/**
 * @method GET
 * @route /api/auth/logout
 */
router.get('/logout', signOut);

/**
 * @method GET
 * @route /api/auth/is-signed-in
 */
router.get('/is-signed-in', isSignedIn, (req: Request, res: Response) => {
    // @ts-ignore
    res.json(req.auth);
});

export default router;
