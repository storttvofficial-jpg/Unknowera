import { useState } from 'react';
import { ExtractedFile } from '../types';
import FilePreviewModal from './FilePreviewModal';

interface Props {
  files: ExtractedFile[];
}

const FileTree = ({ files }: Props) => {
  const [selectedFile, setSelectedFile] = useState<ExtractedFile | null>(null);

  return (
    <div className="border rounded p-2 max-h-48 overflow-y-auto">
      <div className="text-sm font-medium mb-1">Uploaded Files ({files.length})</div>
      {files.map((file, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => setSelectedFile(file)}
        >
          <span>📄</span>
          <span className="truncate text-sm">{file.path}</span>
          <span className="text-xs text-gray-400">{file.size} bytes</span>
        </div>
      ))}
      {selectedFile && (
        <FilePreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </div>
  );
};

export default FileTree;
