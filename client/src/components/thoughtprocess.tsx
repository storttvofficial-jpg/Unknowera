import { useState } from 'react';

interface Props {
  thought: string;
}

const ThoughtProcess = ({ thought }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        <span>{expanded ? '▼' : '▶'}</span> Thought Process
      </button>
      {expanded && (
        <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          {thought}
        </div>
      )}
    </div>
  );
};

export default ThoughtProcess;
