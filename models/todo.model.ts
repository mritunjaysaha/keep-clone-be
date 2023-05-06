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
        theme: { type: String },
        images: { type: String },
        reminder: { type: String },
        hasReminder: { type: Boolean },
        isPinned: { type: Boolean },
        label: { type: String },
        lastEdited: { type: String },
    },
    { timestamps: true },
);

export const TodoModel: Model<ITodo> = model<ITodo>('todo', TodoSchema);
