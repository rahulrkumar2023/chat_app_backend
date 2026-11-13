import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());


app.use('/api', apiRouter);




app.use( () => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
}
);


app.listen(PORT, () => {
  console.log(`Chat backend server actively listening on port ${PORT}`);
});

export default app;
