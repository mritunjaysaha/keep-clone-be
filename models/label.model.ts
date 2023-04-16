import { model, Schema, Model, Document } from 'mongoose';

interface ILabel extends Document {
    labelName: string;
    todo: string[];
}

const LabelSchema: Schema = new Schema(
    {
        labelName: { type: String, required: true, trim: true, unique: true },
        todo: [{ type: Schema.Types.ObjectId, ref: 'todo' }],
    },
    { timestamps: true },
);

export const LabelModel: Model<ILabel> = model<ILabel>('label', LabelSchema);
