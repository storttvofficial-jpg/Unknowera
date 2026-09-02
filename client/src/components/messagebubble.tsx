import { Message } from '../types';
import CodeBlock from './CodeBlock';
import ThoughtProcess from './ThoughtProcess';
import CommandOutput from './CommandOutput';
import SearchResults from './SearchResults';
import { detectLanguage } from '../utils/codeUtils';

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === 'user';

  // Parse code blocks in content
  const parseContent = (content: string) => {
    const parts = [];
    const regex = /```(\w+)(?::([^\n]+))?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      parts.push({
        type: 'code',
        language: match[1],
        path: match[2],
        code: match[3],
      });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }
    return parts;
  };

  const contentParts = parseContent(message.content);

  return (
    <div className={`message-enter flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {!isUser && message.thought && <ThoughtProcess thought={message.thought} />}
        {!isUser && message.commands && message.commands.length > 0 && (
          <div className="mb-2">
            {message.commands.map((cmd, idx) => (
              <CommandOutput key={idx} command={cmd.command} output={cmd.output} error={cmd.error} />
            ))}
          </div>
        )}
        {!isUser && message.searchResults && message.searchResults.length > 0 && (
          <div className="mb-2">
            <SearchResults results={message.searchResults} />
          </div>
        )}

        {contentParts.map((part, idx) => {
          if (part.type === 'text') {
            return <div key={idx} className="whitespace-pre-wrap">{part.content}</div>;
          } else {
            return (
              <CodeBlock
                key={idx}
                code={part.code}
                language={part.language || detectLanguage(part.code)}
                filename={part.path}
              />
            );
          }
        })}

        {!isUser && message.files && message.files.length > 0 && (
          <div className="mt-3 border-t pt-2">
            <div className="font-medium mb-1">Generated Files ({message.files.length})</div>
            <div className="text-sm text-gray-600">
              {message.files.map(f => (
                <div key={f.path} className="truncate">{f.path}</div>
              ))}
            </div>
            <button
              onClick={async () => {
                const { createZipFromFiles } = await import('../utils/zipUtils');
                const blob = await createZipFromFiles(message.files!);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'app.zip';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Download ZIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
