export interface Message {
  role: 'user' | 'assistant';
  content: string;
  thought?: string;
  commands?: CommandResult[];
  searchResults?: SearchResult[];
  files?: GeneratedFile[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface ExtractedFile {
  name: string;
  path: string;
  content?: string;
  blobUrl?: string;
  type: 'text' | 'image' | 'binary';
  size: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface CommandResult {
  command: string;
  output: string;
  error?: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}
