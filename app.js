import express from 'express';
import AuthRoutes from './routes/auth.route.js';

const app = express();

app.use(express.json());

app.use('/api/auth', AuthRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the taxxk API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;