import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import { signup, login, signOut, isSignedIn } from '../../controllers/auth.controller';
import { getUserById } from '../../controllers/user.controller';
import JWT from 'jsonwebtoken';
import passport from '../../utils/passport';

const router = Router();

router.param('userId', getUserById);

/**
 * @method POST
 * @route /api/v1/auth/signup
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
 * @route /api/v1/auth/login
 */
router.post(
    '/login',
    // [check('email', 'E-mail is required').isEmail(), check('password', 'Password is require').isLength({ min: 1 })],
    // // login,
    passport.authenticate('local', { session: false, failureMessage: true }),
    (req, res) => {
        console.log('[LogIn]');
        if (req.isAuthenticated()) {
            const { email, password } = req.body;

            console.log({ req });

            const token = JWT.sign(
                {
                    iss: 'Mritunjay',
                    sub: email,
                },
                'realmex3superzoom',
                { expiresIn: '2h' },
            );

            res.cookie(
                'access_token',
                token,

                {
                    httpOnly: true,
                    sameSite: true,
                },
            );
            return res.status(200).json({ isAuthenticated: true, user: { email } });
        }
    },
);

/**
 * @method GET
 * @route /api/v1/auth/logout
 */
router.get('/logout', signOut);

/**
 * @method GET
 * @route /api/v1/auth/is-signed-in
 */
router.get('/is-signed-in', isSignedIn, (req: Request, res: Response) => {
    // @ts-ignore
    res.json(req.auth);
});

export default router;
