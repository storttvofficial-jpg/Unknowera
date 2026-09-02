import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import { loadChatHistory, saveChatHistory } from './utils/storage';
import { ChatSession } from './types';

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const saved = loadChatHistory();
    setSessions(saved);
    if (saved.length > 0) setActiveSessionId(saved[0].id);
  }, []);

  useEffect(() => {
    saveChatHistory(sessions);
  }, [sessions]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-gray-800">Unknowera</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              {showUpload ? 'Hide Upload' : 'Upload Files'}
            </button>
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </header>
        {showUpload && <FileUpload />}
        {activeSession ? (
          <Chat
            session={activeSession}
            language={language}
            onUpdateSession={(updated) =>
              setSessions(prev =>
                prev.map(s => s.id === updated.id ? updated : s)
              )
            }
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={handleNewChat}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
