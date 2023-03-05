import { UserModel } from '../models/user.model';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { expressjwt } from 'express-jwt';

export const signup = (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // @ts-ignore
        return res.status(422).json({ error: errors.errors[0].msg });
    }

    const user = new UserModel(req.body);

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        return res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
        });
    });
};

export const login = (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors });
    }

    const { email, password } = req.body;

    // @ts-ignore
    UserModel.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email doesn't exists",
                message: err.message,
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match',
            });
        }

        // @ts-ignore
        // create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // @ts-ignore
        // put token in cookie
        res.cookie('token', token, { expire: new Date() + 9999 });

        // send response to frontend
        const { _id, email, firstName, lastName } = user;

        return res.json({
            token,
            user: { _id, email, firstName, lastName },
        });
    });
};

export const signOut = (req: Request, res: Response) => {
    res.clearCookie('token');

    return res.json({ message: 'signed out' });
};

export const isSignedIn = expressjwt({
    secret: process.env.SECRET,
    userProperty: 'auth',
    algorithms: ['sha1', 'RS256', 'HS256'],
});

// @ts-ignore
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const { profile, auth } = req;

    const checker = profile && auth && profile._id.toString() === auth._id;

    console.log('[isAuthenticated]', { profile, auth, checker });

    if (!checker) {
        return res.status(403).json({ error: '[ACCESS DENIED]' });
    }

    next();
};
