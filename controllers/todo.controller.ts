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

    console.log('[createTodo]', { body });

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

export const updateTodo = async (req: Request, res: Response) => {
    console.log('[updateTodo]', req.params);
    const { todoId } = req.params;
    const updates = req.body;

    try {
        const updatedTodo = await TodoModel.findOneAndUpdate({ todoId }, updates, { new: true });

        if (!updatedTodo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }

        return res.json({ success: true, message: 'Todo successfully updated' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error updating todo', error: err.message });
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

export const getAllTodoByUserId = async (req: Request, res: Response) => {
    const { email } = req.profile;

    console.log('[getAllTodoByUserId]', { email });

    try {
        const user = await UserModel.findOne({ email }).populate('todos');

        if (!user) {
            return res.status(400).json({ success: false, message: `Failed to get todos for ${email}` });
        }

        return res.json({ success: true, message: 'Todos populated successfully', todos: user.todos });
    } catch (err) {
        return res.status(400).json({ success: false, message: `Failed to get todos for ${email}` });
    }
};
