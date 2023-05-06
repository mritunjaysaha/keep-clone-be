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

export const createTodo = async (req: Request, res: Response) => {
    const { body, profile } = req;

    const existingTodo = await TodoModel.findOne({ todoId: body.todoId });

    if (existingTodo) {
        return res.status(400).json({ success: false, message: 'Duplicate todo id' });
    }

    const newTodo = new TodoModel(body);

    try {
        const savedTodo = await newTodo.save();

        if (savedTodo?.todoId) {
            const user = await UserModel.findOneAndUpdate(
                { email: profile.email },
                { $push: { todos: savedTodo._id } },
                { new: true, upsert: true },
            );

            if (!user) {
                await savedTodo.remove();

                return res.status(400).json({ success: false, message: 'Failed to save todo' });
            }
        }

        return res.json({ success: true, message: 'Successfully saved todo' });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Failed to save todo', error: err.message });
    }
};

export const removeTodo = async (req: Request, res: Response) => {
    const deletedTodo = await TodoModel.deleteOne({ todoId: req.params.todoId });

    console.log('[removeTodo]', { deletedTodo });

    if (deletedTodo?.deletedCount > 0) {
        return res.json({ success: true, message: `${req.params.todoId} successfully deleted` });
    }

    return res.status(400).json({ success: false, message: `Failed to delete todo with id:${req.params.todoId}` });
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
