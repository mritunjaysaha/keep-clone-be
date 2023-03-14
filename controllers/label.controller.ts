import { Request, Response, NextFunction } from 'express';

import { UserModel } from '../models/user.model';
import { LabelModel } from '../models/label.model';

export const getLabelById = (req: Request, res: Response, next: NextFunction, id: string) => {
    LabelModel.findById(id).exec((err, todo) => {
        if (err) {
            res.status(400).json({ error: 'Label not found' });
        }

        req.label = label;
        req.label.id = id;
    });
};

export const getLabel = (req: Request, res: Response) => {
    return res.json(req.label);
};

export const createLabel = (req: Request, res: Response) => {
    const label = new LabelModel(req.body);

    console.log('[createLabel]', req.body);

    label.save((err, todo) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to create label', msg: err.message });
        }

        UserModel.findByIdAndUpdate(
            req.profile._id,
            { $push: { label: label._id } },
            { new: true, upsert: true },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: 'Failed to create label', msg: err });
                }
            },
        );

        return res.json(label);
    });
};

/**
 * TODO: remove labels from all the todo
 * @param req
 * @param res
 */
export const removeLabel = (req: Request, res: Response) => {
    LabelModel.deleteOne({ _id: req.label.id }, (err, label) => {
        if (err) {
            res.status(400).json({ error: 'Failed to delete todo' });
        }

        return res.json({ msg: 'Label deleted successfully' });
    });
};

export const getAllLabelByUserId = (req: Request, res: Response) => {
    UserModel.findById(req.profile.id)
        .populate('label')
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({ message: 'Failed to populate labels', error: err.message });
            }

            return res.json(user.label);
        });
};

export const getAllTodoByLabelId = (req: Request, res: Response) => {
    console.log('[getAllTodoByLabelId]', req.label);

    LabelModel.findById(req.label.id)
        .populate('todo')
        .exec((err, label) => {
            if (err) {
                return res.status(400).json({ message: 'Failed to populate', error: err.message });
            }

            return res.json(label.todo);
        });
};
