import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import executeRouter from './routes/execute.js';
import searchRouter from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/chat', chatRouter);
app.use('/api/execute', executeRouter);
app.use('/api/search', searchRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
