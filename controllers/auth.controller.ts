import { UserModel } from '../models/user.model';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { expressjwt } from 'express-jwt';
import passport from 'passport';

export const signup = (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // @ts-ignore
        return res.status(422).json({ error: errors.errors[0].msg });
    }

    // const user = new UserModel(req.body);

    // user.save((err, user) => {
    //     if (err) {
    //         return res.status(400).json({ error: err.message });
    //     }

    //     return res.json({
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         email: user.email,
    //         id: user._id,
    //     });
    // });

    console.log('[SignUp]');

    const { email, password } = req.body;

    UserModel.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error has occurred', success: false });
        }

        if (user) {
            return res.status(400).json({ message: 'Email is already in use', success: false });
        } else {
            const newUser = new UserModel({ email, password });

            newUser.save((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error has occurred', success: false });
                } else {
                    return res.status(201).json({ message: 'Account successfully created', success: false });
                }
            });
        }
    });
};

export const login = (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors });
    }

    const { email, password } = req.body;

    // // @ts-ignore
    // UserModel.findOne({ email }, (err, user) => {
    //     if (err || !user) {
    //         return res.status(400).json({
    //             error: "Email doesn't exists",
    //             message: err.message,
    //         });
    //     }

    //     if (!user.authenticate(password)) {
    //         return res.status(401).json({
    //             error: 'Email and password do not match',
    //         });
    //     }

    //     // @ts-ignore
    //     // create token
    //     const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //     // @ts-ignore
    //     // put token in cookie
    //     res.cookie('token', token, { expire: new Date() + 9999 });

    //     // send response to frontend
    //     const { email, firstName, lastName } = user;

    //     passport.authenticate('local', { failureRedirect: '/login', failureMessage: true });

    //     return res.json({
    //         token,
    //         user: { email, firstName, lastName },
    //     });
    // });

    // passport.authenticate('local', { session: false });
};

export const signOut = (req: Request, res: Response) => {
    res.clearCookie('token');

    return res.json({ message: 'signed out' });
};

export const isSignedIn = expressjwt({
    secret: process.env.SECRET,
    userProperty: 'auth',
    algorithms: ['sha256', 'RS256', 'HS256'],
});

// @ts-ignore
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const { profile, auth } = req;

    const checker = profile && auth && profile._id.toString() === auth._id;

    if (!checker) {
        return res.status(401).json({ error: '[ACCESS DENIED]' });
    }

    next();
};
