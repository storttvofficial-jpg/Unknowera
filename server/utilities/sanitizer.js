const ALLOWED_COMMANDS = [
  'ls', 'cat', 'unzip', 'file', 'node -v', 'npm -v', 'python --version', 'pwd', 'echo'
];

export function sanitizeCommand(command) {
  const base = command.trim().split(/\s+/)[0];
  return ALLOWED_COMMANDS.includes(base);
}
