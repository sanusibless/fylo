import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { route } from 'ziggy-js';


interface User {
    id: number;
    name: string;
    email: string;
}

interface AutoCompleteSearchInputProps {
    value : string,
    onSelect : (e : string) => object,
}

export default function AutoCompleteSearchInput({ onSelect, value } : AutoCompleteSearchInputProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<null | User>(null);

  // Debounce typing (optional but good UX)
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const response = await fetch(route('users.search', { query }));
      const data = await response.json();
      setResults(data.data);
      setLoading(false);
    }, 400); // wait 400ms after typing

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (user : User) => {
    setSelected(user);
    setQuery(user.name);
    setResults([]);
    onSelect?.(user.email); // optional callback
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search user..."
        value={query ?? ''}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="text-xs text-gray-400 mt-1">Searching...</p>}

      {results.length > 0 && (
        <Card className="absolute z-10 w-full mt-2 p-2 bg-white shadow-lg">
          {results.map((user : User) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => handleSelect(user)}
            >
                <div className='flex flex-col'>
                    <span>{user.name}</span>
                    <span>({user.email})</span>
                </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
