import { Request, Response, NextFunction } from 'express';

import { UserModel } from '../models/user.model';
import { LabelModel } from '../models/label.model';

export const getLabelById = (req: Request, res: Response, next: NextFunction, id: string) => {
    console.log('[getLabelById]', id, req.body);
    LabelModel.findOne({ labelId: id }).exec((err, label) => {
        if (err) {
            res.status(400).json({ error: 'Label not found' });
        }

        console.log('[getLabelById]', { label });
        req.label = label;

        next();
    });
};

export const getLabel = (req: Request, res: Response) => {
    return res.json(req.label);
};

export const createOrUpdateLabel = async (req: Request, res: Response) => {
    const { body, params, profile, label } = req;

    const { labelId } = params;

    const existingLabelId = label?.labelId ?? '';

    console.log('[createOrUpdateLabel]', { body, label, labelId });

    try {
        let label;

        if (existingLabelId) {
            label = await LabelModel.findOneAndUpdate({ labelId }, body, { new: true });
        } else {
            const labelData = {
                labelId,
                labelName: body.labelName,
            };

            console.log('[createOrUpdateLabel] here', { labelData });

            const newLabel = new LabelModel(labelData);
            label = await newLabel.save();

            console.log('[createOrUpdateLabel] here', { newLabel });

            if (label?.labelId) {
                const user = await UserModel.findOneAndUpdate(
                    { email: profile.email },
                    { $push: { labels: label._id } },
                    { new: true, upsert: true },
                );

                console.log({ user });

                if (!user) {
                    await label.remove();

                    return res.status(400).json({
                        success: false,
                        message: 'Failed to create a label',
                    });
                }
            }
        }

        if (label) {
            return res.json({ success: true, message: 'Label saved successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Failed update label' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err });
    }
};

/**
 * TODO: remove labels from all the todo
 * @param req
 * @param res
 */
export const removeLabel = (req: Request, res: Response) => {
    const { label } = req;
    console.log('[removeLabel]', { label });
    LabelModel.deleteOne({ labelId: label.labelId }, (err, label) => {
        if (err) {
            res.status(400).json({ error: 'Failed to delete todo' });
        }

        return res.json({ msg: 'Label deleted successfully' });
    });
};

export const getAllLabelByUserId = async (req: Request, res: Response) => {
    try {
        const { email } = req.profile;
        const user = await UserModel.findOne({ email }).populate('labels');

        if (!user) {
            return res.status(400).json({ suceess: false, message: `Failed to get labels for ${email}` });
        }

        return res.json({ success: true, message: 'Labels populated successfully', labels: user.labels });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to get labels', error: err });
    }
};

export const getAllTodoByLabelId = (req: Request, res: Response) => {
    LabelModel.findById(req.label.id)
        .populate('todo')
        .exec((err, label) => {
            if (err) {
                return res.status(400).json({ message: 'Failed to populate', error: err.message });
            }

            return res.json(label.todo);
        });
};

export const addTodoToALabel = (req: Request, res: Response) => {
    LabelModel.findByIdAndUpdate(
        req.label.id,
        { $push: { todo: req.todo.id } },
        { new: true, upsert: true },
        (err, label) => {
            if (err || !label) {
                return res.status(400).json({ error: 'Failed to assign label', msg: err });
            }
            return res.json(label);
        },
    );
};
