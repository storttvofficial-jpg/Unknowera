import axios from 'axios';
import { Message } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function sendMessage(messages: Message[], language: string): Promise<Message> {
  const response = await axios.post(`${API_BASE}/api/chat`, { messages, language });
  return response.data;
}

export async function executeCommand(command: string) {
  const response = await axios.post(`${API_BASE}/api/execute`, { command });
  return response.data;
}

export async function webSearch(query: string) {
  const response = await axios.get(`${API_BASE}/api/search`, { params: { q: query } });
  return response.data.results;
}
