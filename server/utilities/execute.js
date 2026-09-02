import { exec } from 'child_process';
import { promisify } from 'util';
import { sanitizeCommand } from './sanitizer.js';

const execAsync = promisify(exec);

export async function executeCommand(command) {
  if (!sanitizeCommand(command)) {
    return { output: '', error: 'Command not allowed' };
  }
  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
    return { output: stdout || stderr, error: stderr || '' };
  } catch (error) {
    return { output: error.stdout || '', error: error.message };
  }
}
