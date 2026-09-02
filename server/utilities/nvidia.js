import axios from 'axios';
import { TOOLS } from './tools.js';
import { executeCommand } from './executeCommand.js';
import { webSearch } from './webSearch.js';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const API_KEY = process.env.NVIDIA_API_KEY;

export async function callNVIDIA(messages, tools = []) {
  const payload = {
    model: 'nvidia/nemotron-3.5',
    messages,
    temperature: 0.7,
    max_tokens: 2048,
    tools: tools.length ? tools : undefined,
    tool_choice: 'auto'
  };

  const response = await axios.post(NVIDIA_API_URL, payload, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

export async function processToolCalls(messages) {
  // First call to NVIDIA with tools
  const firstResponse = await callNVIDIA(messages, TOOLS);
  const firstMessage = firstResponse.choices[0].message;

  // If no tool calls, return the assistant message directly
  if (!firstMessage.tool_calls || firstMessage.tool_calls.length === 0) {
    return {
      role: 'assistant',
      content: firstMessage.content,
      thought: firstMessage.thought || extractThought(firstMessage.content),
      commands: [],
      searchResults: [],
      files: parseGeneratedFiles(firstMessage.content)
    };
  }

  // Process tool calls
  const toolResults = [];
  for (const toolCall of firstMessage.tool_calls) {
    const { name, arguments: args } = toolCall;
    let result;
    if (name === 'execute_command') {
      const cmdResult = await executeCommand(args.command);
      result = { command: args.command, output: cmdResult.output };
      toolResults.push({ type: 'command', result });
    } else if (name === 'web_search') {
      const searchResults = await webSearch(args.query);
      result = { query: args.query, results: searchResults };
      toolResults.push({ type: 'search', result });
    }
  }

  // Append tool results to conversation
  const toolMessages = toolResults.map((tr, idx) => ({
    role: 'tool',
    tool_call_id: firstMessage.tool_calls[idx].id,
    content: JSON.stringify(tr.result)
  }));

  const updatedMessages = [...messages, firstMessage, ...toolMessages];

  // Second call to get final answer
  const secondResponse = await callNVIDIA(updatedMessages, []);
  const finalMessage = secondResponse.choices[0].message;

  return {
    role: 'assistant',
    content: finalMessage.content,
    thought: firstMessage.thought || extractThought(finalMessage.content),
    commands: toolResults.filter(tr => tr.type === 'command').map(tr => tr.result),
    searchResults: toolResults.filter(tr => tr.type === 'search').map(tr => tr.result.results).flat(),
    files: parseGeneratedFiles(finalMessage.content)
  };
}

function extractThought(content) {
  // Simple extraction: first sentence or similar
  const firstLine = content.split('\n')[0];
  return `Thinking: ${firstLine}`;
}

function parseGeneratedFiles(content) {
  // Look for code blocks with filename syntax ```lang:path
  const regex = /```(\w+):([^\n]+)\n([\s\S]*?)```/g;
  const files = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    files.push({
      path: match[2],
      content: match[3],
      language: match[1]
    });
  }
  return files.length > 0 ? files : undefined;
}
