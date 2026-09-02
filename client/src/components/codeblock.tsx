import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getFileExtension } from '../utils/codeUtils';

interface Props {
  code: string;
  language: string;
  filename?: string;
}

const CodeBlock = ({ code, language, filename }: Props) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = getFileExtension(language);
    const defaultName = filename || `code.${ext}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canPreview = ['html', 'javascript', 'jsx', 'css'].includes(language);

  return (
    <div className="relative group my-2">
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        {canPreview && (
          <button
            onClick={() => setShowPreview(true)}
            className="bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600"
          >
            Preview
          </button>
        )}
        <button
          onClick={handleDownload}
          className="bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600"
        >
          Download
        </button>
      </div>
      {filename && (
        <div className="bg-gray-200 text-xs px-3 py-1 rounded-t font-mono">{filename}</div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem' }}
      >
        {code}
      </SyntaxHighlighter>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-3/4 h-3/4 flex flex-col">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold">Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="flex-1 border rounded overflow-hidden">
              <iframe
                title="preview"
                sandbox="allow-scripts"
                srcDoc={code}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
