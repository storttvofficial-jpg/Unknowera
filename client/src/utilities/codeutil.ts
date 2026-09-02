export function detectLanguage(code: string): string {
  if (/^\s*<\?php/.test(code)) return 'php';
  if (/^\s*<!DOCTYPE html>/i.test(code) || /<html[\s>]/i.test(code)) return 'html';
  if (/^\s*<\?xml/.test(code)) return 'xml';
  if (/import\s+React|from\s+['"]react['"]/.test(code) && /jsx/.test(code)) return 'jsx';
  if (/import\s+.*from\s+['"].*['"]|export\s+default|export\s+const/.test(code)) return 'typescript';
  if (/^#!.*\bpython|def\s+\w+\(|import\s+\w+/.test(code)) return 'python';
  if (/function\s+\w+\(|const\s+\w+\s*=\s*\(?.*\)?\s*=>/.test(code)) return 'javascript';
  if (/^\s*\.?[a-zA-Z-]+\s*\{/.test(code)) return 'css';
  if (/^\s*\{[\s\S]*\}/.test(code)) return 'json';
  return 'plaintext';
}

export function getFileExtension(language: string): string {
  const map: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    jsx: 'jsx',
    tsx: 'tsx',
    python: 'py',
    html: 'html',
    css: 'css',
    json: 'json',
    php: 'php',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    ruby: 'rb',
    go: 'go',
    rust: 'rs',
    yaml: 'yml',
    xml: 'xml',
    sql: 'sql',
    shell: 'sh',
    bash: 'sh',
    plaintext: 'txt',
  };
  return map[language] || 'txt';
}
