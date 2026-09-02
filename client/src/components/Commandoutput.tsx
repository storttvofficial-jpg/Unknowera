interface Props {
  command: string;
  output?: string;
  error?: string;
}

const CommandOutput = ({ command, output, error }: Props) => {
  return (
    <div className="bg-gray-900 text-gray-100 rounded p-2 font-mono text-xs">
      <div className="text-gray-400">$ {command}</div>
      {output && <pre className="whitespace-pre-wrap mt-1 text-green-400">{output}</pre>}
      {error && <pre className="whitespace-pre-wrap mt-1 text-red-400">{error}</pre>}
    </div>
  );
};

export default CommandOutput;
