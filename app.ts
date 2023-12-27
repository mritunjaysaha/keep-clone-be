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
    'local',
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
        console.log('[LocalStrategy]');
        UserModel.findOne({ email }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!user.authenticate(password)) {
                return done(null, false);
            } else {
                return done(null, this);
            }
        });
    }),
);

passport.serializeUser((user, done) => {
    console.log('[Passport] serialize user', { user });
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    console.log('[Passport] deserialize user', { email });
    UserModel.findOne({ email }, (err, user) => {
        done(err, user);
    });
});

// CONNECT DATABASE
connectDB();

//  INITIALIZE EXPRESS MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
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
