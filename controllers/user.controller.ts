import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';

export const getUserById = (req: Request, res: Response, next: NextFunction, id: string) => {
    console.log('[getUserById]', { id, req });
    UserModel.findOne({ email: id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'No user found',
            });
        }
        console.log({ user });
        req.profile = user;

        next();
    });
};

export const getUser = (req: Request, res: Response) => {
    req.profile.salt = undefined;
    req.profile.encryptedPassword = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
};
