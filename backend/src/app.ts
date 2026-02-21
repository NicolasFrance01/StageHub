import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'StageHub API is running' });
});

// Routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import orderRoutes from './routes/order.routes';
import ticketRoutes from './routes/ticket.routes';

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);

export default app;
