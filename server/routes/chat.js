import express from 'express';
import { callNVIDIA, processToolCalls } from '../utils/nvidia.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { messages, language } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  // Add system prompt based on language
  const systemPrompt = `You are Unknowera, a helpful assistant. Respond in ${language === 'hi' ? 'Hindi' : 'English'}. 
  When user provides an error, give structured troubleshooting with possible causes, fixes, recommended tools, and code examples.
  When asked to build an app, generate all files as separate code blocks with file path markers like:
  ```javascript:src/App.js
  // code
