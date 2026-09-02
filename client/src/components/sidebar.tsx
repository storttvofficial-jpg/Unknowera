import { ChatSession } from '../types';

interface Props {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar = ({ sessions, activeId, onSelect, onNewChat }: Props) => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {sessions.map(session => (
          <div
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`p-3 rounded-lg cursor-pointer mb-1 ${
              session.id === activeId
                ? 'bg-gray-700'
                : 'hover:bg-gray-800'
            }`}
          >
            <div className="truncate text-sm font-medium">{session.title}</div>
            <div className="text-xs text-gray-400">
              {new Date(session.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
