import { model, Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    salt: string;
}

const UserSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        encryptedPassword: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
        },
    },
    { timestamps: true },
);

export const UserModel: Model<IUser> = model<IUser>('users', UserSchema);
