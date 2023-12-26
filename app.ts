require('dotenv').config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.config';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';

// ROUTES
import authRoutes from './routes/v1/auth.routes';
import userRoutes from './routes/v1/user.routes';
import todoRoutes from './routes/v1/todo.routes';
import labelRoutes from './routes/v1/label.routes';
import { UserModel } from './models/user.model';

//  INITIALIZE APP
const app: Express = express();

// INITIALIZE PASSPORT
passport.use(
    new LocalStrategy((email, password, done) => {
        UserModel.findOne({ email: email }, (err, user) => {
            console.log('[Passport]', { err, user });
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (user.authenticate(password)) {
                // return res.status(401).json({
                //     error: 'Email and password do not match',
                // });

                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        });
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    UserModel.findOne({ email }, (err, user) => {
        done(err, user);
    });
});

// CONNECT DATABASE
connectDB();

//  INITIALIZE EXPRESS MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ extend: false }));
app.use(
    session({
        secret: process.env.SECRET ?? 'development_secret',
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// END POINTS
app.get('/', (req: Request, res: Response) => {
    res.send('Server up and running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/labels', labelRoutes);

export { app };
