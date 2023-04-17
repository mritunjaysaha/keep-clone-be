import { model, Schema, Model, Document } from 'mongoose';
import crypto from 'crypto';
import { v1 as uuidV1 } from 'uuid';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    salt: string;
    todo: string[];
    label: string[];
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
            maxlength: 32,
            trim: true,
            required: true,
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
        todo: [{ type: Schema.Types.ObjectId, ref: 'todo' }],
        label: [{ type: Schema.Types.ObjectId, ref: 'label' }],
    },
    { timestamps: true },
);

UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidV1();
        this.encryptedPassword = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function (plainPassword: string) {
        return this.securePassword(plainPassword) === this.encryptedPassword;
    },
    securePassword: function (plainPassword: string) {
        if (!plainPassword) return '';

        try {
            return crypto.createHmac('sha256', this.salt).update(plainPassword).digest('hex');
        } catch (err) {
            return '';
        }
    },
};

export const UserModel: Model<IUser> = model<IUser>('users', UserSchema);
