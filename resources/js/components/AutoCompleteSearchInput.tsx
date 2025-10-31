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
    onSelect : (value : string) => void,
}

export default function AutoCompleteSearchInput({ onSelect, value } : AutoCompleteSearchInputProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [selected, setSelected] = useState<null | User>(null);

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
    // setSelected(user);
    setQuery(user.email);
    setResults([]);
    onSelect(user.email); // optional callback
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
        <Card className="z-10 w-full mt-2 p-2 bg-dark shadow-lg border-0 border-bottom">
          {results.map((user : User) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer hover:bg-dark-100 rounded"
              onClick={() => handleSelect(user)}
            >
                <div className='flex'>
                    <span className="mr-2">{user.name}</span>
                    <span>({user.email})</span>
                </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
