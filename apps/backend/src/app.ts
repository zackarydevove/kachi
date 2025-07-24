import express from 'express';
import userRoutes from './routes/user.route';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', userRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
