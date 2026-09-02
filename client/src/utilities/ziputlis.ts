import JSZip from 'jszip';
import { ExtractedFile, GeneratedFile } from '../types';

export async function extractZip(file: File): Promise<ExtractedFile[]> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const files: ExtractedFile[] = [];

  for (const [path, entry] of Object.entries(contents.files)) {
    if (entry.dir) continue;
    const blob = await entry.async('blob');
    const size = blob.size;
    const name = path.split('/').pop() || path;

    let type: ExtractedFile['type'] = 'binary';
    let content: string | undefined;
    let blobUrl: string | undefined;

    if (blob.type.startsWith('text/') || /\.(txt|md|js|ts|jsx|tsx|json|html|css|py|java|c|cpp|php|rb|go|rs|yml|yaml)$/i.test(name)) {
      content = await entry.async('string');
      type = 'text';
    } else if (blob.type.startsWith('image/')) {
      blobUrl = URL.createObjectURL(blob);
      type = 'image';
    }

    files.push({ name, path, content, blobUrl, type, size });
  }
  return files;
}

export async function createZipFromFiles(files: GeneratedFile[]): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.path, file.content);
  }
  return zip.generateAsync({ type: 'blob' });
}
