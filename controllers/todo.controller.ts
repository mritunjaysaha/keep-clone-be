import { ITodo, TodoModel } from '../models/todo.model';
import { IUser, UserModel } from '../models/user.model';

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

export const createOrUpdateTodo = async (req: Request, res: Response) => {
    const { body, profile, params, todo } = req;

    const { todoId } = params;
    const existingTodoId = todo?.todoId ?? '';
    console.log('[createOrUpdateTodo]', { body, todoId, existingTodoId });

    const updates = body;

    try {
        let todo;
        if (existingTodoId) {
            // update existing todo
            todo = await TodoModel.findOneAndUpdate({ todoId }, updates, { new: true });
        } else {
            body.todoId = todoId;

            console.log('[createOrUpdateTodo] here', { body });

            const newTodo = new TodoModel(body);
            todo = await newTodo.save();

            if (todo?.todoId) {
                const user = await UserModel.findOneAndUpdate(
                    { email: profile.email },
                    { $push: { todos: todo._id } },
                    { new: true, upsert: true },
                );

                if (!user) {
                    await todo.remove();

                    return res.status(400).json({ success: false, message: 'Failed to create todo' });
                }
            }
        }

        if (todo) {
            return res.json({ success: true, message: 'Todo saved successfully', todo });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to update todo' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err });
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
