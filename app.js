import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the taxxk API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;