export const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'execute_command',
      description: 'Execute a safe command on the server to perform file operations or run scripts',
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'The command to execute (e.g., "ls -la", "unzip file.zip")'
          }
        },
        required: ['command']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for current information',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query'
          }
        },
        required: ['query']
      }
    }
  }
];
