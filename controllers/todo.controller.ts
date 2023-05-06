import { TodoModel } from '../models/todo.model';
import { UserModel } from '../models/user.model';

import { NextFunction, Request, Response } from 'express';

export const getTodoById = (req: Request, res: Response, next: NextFunction, id: string) => {
    console.log('[getTodoById]', { id });
    TodoModel.findOne({ todoId: id }).exec((err, todo) => {
        if (err) {
            return res.status(400).json({ message: 'todo not found', error: err.message });
        }

        req.todo = todo;

        console.log('[getTodoById]', { todo });
        next();
    });
};

export const createTodo = (req: Request, res: Response) => {
    console.log('[createTodo]', { body: req.body, todoId: req.body.todoId });

    // check whether todo id already exists
    TodoModel.findOne({ todoId: req.body.todoId })
        .then((todo) => {
            console.log('[createTodo]', { todo });

            return res.status(403).json({ message: 'Duplicate todoId' });
        })
        .catch((err) => {
            return res.status(403).json({ message: 'Something went wrong', error: err });
        });

    // Save the todo
    const todo = new TodoModel(req.body);

    todo.save((err, todo) => {
        if (err) {
            return res.status(400).json({ message: 'Failed to create todo', error: err.message });
        }

        UserModel.findByIdAndUpdate(
            req.profile._id,
            { $push: { todos: todo.todoId } },
            { new: true, upsert: true },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ message: 'Failed to create todo', error: err.message });
                }
            },
        );

        return res.json(todo);
    });
};

export const removeTodo = (req: Request, res: Response) => {
    console.log('[removeTodo]', req.params.todoId);
    TodoModel.deleteOne({ todoId: req.params.todoId }, (err, todo) => {
        if (err) {
            res.status(400).json({ message: 'Failed to find todo', error: err.message });
        }

        return res.json({ message: 'Todo successfully deleted' });
    });
};

export const getTodo = (req: Request, res: Response) => {
    return res.json(req.todo);
};

export const getAllTodoByUserId = (req: Request, res: Response) => {
    console.log('[getAllTodoByUserId]', { email: req.profile.email });
    UserModel.findOne({ email: req.profile.email })
        .populate('todos')
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({ message: 'Failed to populate', error: err.message });
            }

            return res.json(user.todo);
        });

    // return res.json(req.profile);
};
