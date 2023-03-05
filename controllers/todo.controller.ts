import { TodoModel } from '../models/todo.model';
import { UserModel } from '../models/user.model';

import { Request, Response } from 'express';

export const createTodo = (req: Request, res: Response) => {
    const todo = new TodoModel(req.body);

    console.log('[createTodo]', req.body);

    todo.save((err, todo) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to create todo', msg: err.message });
        }

        UserModel.findByIdAndUpdate(
            req.profile._id,
            { $push: { todo: todo._id } },
            { new: true, upsert: true },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: 'Failed to create todo', msg: err });
                }
            },
        );

        return res.json(todo);
    });
};
