import { TodoModel } from '../models/todo.model';
import { UserModel } from '../models/user.model';

import { NextFunction, Request, Response } from 'express';

export const getTodoById = (req: Request, res: Response, next: NextFunction, id: string) => {
    console.log('[getTodoById]', { id });
    TodoModel.findById(id).exec((err, todo) => {
        if (err) {
            res.status(400).json({ error: 'todo not found' });
        }

        req.todo = todo;

        next();
    });
};

export const createTodo = (req: Request, res: Response) => {
    const todo = new TodoModel(req.body);

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

export const removeTodo = (req: Request, res: Response) => {
    TodoModel.deleteOne({ _id: req.params.todoId }, (err, todo) => {
        if (err) {
            res.status(400).json({ error: 'Failed to find todo' });
        }

        return res.json({ msg: 'Todo successfully deleted' });
    });
};

export const getTodo = (req: Request, res: Response) => {
    return res.json(req.todo);
};

export const getAllTodoByUserId = (req: Request, res: Response) => {
    console.log('[getAllTodoByUserId]', { profile: req.profile });
    UserModel.findById(req.profile.id)
        .populate('todo')
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({ message: 'Failed to populate', error: err.message });
            }

            return res.json(user.todo);
        });

    // return res.json(req.profile);
};
