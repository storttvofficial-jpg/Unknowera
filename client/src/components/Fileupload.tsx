import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractZip } from '../utils/zipUtils';
import { ExtractedFile } from '../types';
import FileTree from './FileTree';

const FileUpload = () => {
  const [files, setFiles] = useState<ExtractedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    const allFiles: ExtractedFile[] = [];
    for (const file of acceptedFiles) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        const extracted = await extractZip(file);
        allFiles.push(...extracted);
      } else {
        // For non-ZIP files, create a simple ExtractedFile
        const type: ExtractedFile['type'] = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('text/')
          ? 'text'
          : 'binary';
        const entry: ExtractedFile = {
          name: file.name,
          path: file.name,
          type,
          size: file.size,
        };
        if (type === 'text') {
          entry.content = await file.text();
        } else if (type === 'image') {
          entry.blobUrl = URL.createObjectURL(file);
        }
        allFiles.push(entry);
      }
    }
    setFiles(prev => [...prev, ...allFiles]);
    setIsProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-4 bg-white border-b">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isProcessing ? 'Processing...' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-400">Supports ZIP, images, and any files</p>
      </div>
      {files.length > 0 && (
        <div className="mt-3">
          <FileTree files={files} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
