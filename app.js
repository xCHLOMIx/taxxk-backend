import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/auth.route.js';
import TaskRoutes from './routes/task.route.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Clean middleware
app.use((req, _, next) => {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
});

// App routes
app.use('/api/auth', AuthRoutes);
app.use('/api/tasks', TaskRoutes);

// Default endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the taxxk API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;