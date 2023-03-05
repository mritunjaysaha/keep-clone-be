import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';

export const getUserById = (req: Request, res: Response, next: NextFunction, id: string) => {
    UserModel.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'No user found',
            });
        }

        req.profile = user;

        next();
    });
};

export const getUser = (req: Request, res: Response) => {
    req.profile.salt = undefined;
    req.profile.encrypted_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
};
