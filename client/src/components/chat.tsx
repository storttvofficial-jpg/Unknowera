import { useState } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessage } from '../utils/api';
import { ChatSession, Message } from '../types';

interface Props {
  session: ChatSession;
  language: 'en' | 'hi';
  onUpdateSession: (session: ChatSession) => void;
}

const Chat = ({ session, language, onUpdateSession }: Props) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...session.messages, userMsg];
    onUpdateSession({ ...session, messages: updatedMessages });
    setInput('');
    setIsLoading(true);

    try {
      const assistantMsg = await sendMessage(updatedMessages, language);
      onUpdateSession({
        ...session,
        messages: [...updatedMessages, assistantMsg],
      });
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      onUpdateSession({
        ...session,
        messages: [...updatedMessages, errorMsg],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {session.messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            <span>Thinking...</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
