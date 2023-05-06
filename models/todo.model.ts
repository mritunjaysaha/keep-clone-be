import { model, Schema, Model, Document } from 'mongoose';

export interface ITodo extends Document {
    todoId: string;
    title: string;
    body: string;
    theme: string;
    images: any[];
    reminder: string;
    hasReminder: boolean;
    isPinned: boolean;
    labels: string[];
    lastEdited: string;
}

const TodoSchema: Schema = new Schema(
    {
        todoId: { type: String, required: true },
        title: { type: String, trim: true },
        body: { type: String, trim: true },
        theme: { type: String, default: '' },
        images: { type: [String], default: [] },
        reminder: { type: String, default: '' },
        hasReminder: { type: Boolean, default: false },
        isPinned: { type: Boolean, default: false },
        labels: { type: [String], default: [] },
        lastEdited: { type: String, default: '' },
    },
    { timestamps: true },
);

export const TodoModel: Model<ITodo> = model<ITodo>('todos', TodoSchema);
