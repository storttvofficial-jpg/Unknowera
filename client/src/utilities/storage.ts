import { ChatSession } from '../types';

const STORAGE_KEY = 'unknowera_chat_history';

export function loadChatHistory(): ChatSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(sessions: ChatSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
