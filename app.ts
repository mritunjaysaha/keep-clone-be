require('dotenv').config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.config';

// ROUTES
import authRoutes from './routes/auth.routes';

console.log({ authRoutes });

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
app.use('/api/auth', authRoutes);

export { app };
