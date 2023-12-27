import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { UserModel } from '../models/user.model';

// mongodb config
const db: any = process.env.MONGO_URI;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose.set('strictQuery', false);

export const connectDB = async () => {
    try {
        await mongoose.connect(db, options as any);
        console.log('Database connection established');
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};
