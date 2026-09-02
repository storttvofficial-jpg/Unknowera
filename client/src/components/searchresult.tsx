import { SearchResult } from '../types';

interface Props {
  results: SearchResult[];
}

const SearchResults = ({ results }: Props) => {
  return (
    <div className="space-y-2">
      {results.map((r, idx) => (
        <a
          key={idx}
          href={r.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded p-2 hover:bg-gray-50"
        >
          <div className="text-sm font-medium text-blue-600">{r.title}</div>
          <div className="text-xs text-gray-500 truncate">{r.link}</div>
          <div className="text-sm text-gray-700">{r.snippet}</div>
        </a>
      ))}
    </div>
  );
};

export default SearchResults;
