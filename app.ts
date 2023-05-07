require('dotenv').config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.config';

// ROUTES
import authRoutes from './routes/v1/auth.routes';
import userRoutes from './routes/v1/user.routes';
import todoRoutes from './routes/v1/todo.routes';
import labelRoutes from './routes/v1/label.routes';

//  INITIALIZE APP
const app: Express = express();

// CONNECT DATABASE
connectDB();

//  INITIALIZE MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ extend: false }));

// END POINTS
app.get('/', (req: Request, res: Response) => {
    res.send('Server up and running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/labels', labelRoutes);

export { app };
