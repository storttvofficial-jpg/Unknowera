import { ExtractedFile } from '../types';

interface Props {
  file: ExtractedFile;
  onClose: () => void;
}

const FilePreviewModal = ({ file, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between mb-2">
          <h3 className="font-bold truncate">{file.path}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="flex-1 overflow-auto border rounded">
          {file.type === 'text' && file.content !== undefined ? (
            <pre className="p-4 text-sm whitespace-pre-wrap">{file.content}</pre>
          ) : file.type === 'image' && file.blobUrl ? (
            <img src={file.blobUrl} alt={file.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="p-4">Binary file cannot be previewed</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
