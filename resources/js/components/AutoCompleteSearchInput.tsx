import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { route } from "ziggy-js";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AutoCompleteSearchInputProps {
  value: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function AutoCompleteSearchInput({
  onSelect,
  value,
  disabled = false,
}: AutoCompleteSearchInputProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(route("users.search", { query }));
        const data = await response.json();
        setResults(Array.isArray(data?.data) ? data.data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSelect(val);
  };

  const handleSelect = (user: User) => {
    setQuery(user.email);
    setResults([]);
    onSelect(user.email);
  };

  return (
    <div className="relative w-full">
      <Input
        type="email"
        disabled={disabled}
        placeholder="Enter user email (e.g. colleague@example.com)..."
        value={query ?? ""}
        onChange={handleInputChange}
        className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs"
      />

      {loading && <p className="text-[11px] text-gray-400 mt-1">Searching registered users...</p>}

      {results.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 p-1.5 bg-[#0b1523] border border-slate-700 shadow-xl rounded-xl max-h-48 overflow-y-auto">
          {results.map((user: User) => (
            <button
              key={user.id}
              type="button"
              className="w-full text-left p-2 text-xs text-white hover:bg-slate-800 rounded-lg transition flex items-center justify-between"
              onClick={() => handleSelect(user)}
            >
              <span className="font-semibold truncate">{user.name}</span>
              <span className="text-teal-400 ml-2 truncate">{user.email}</span>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
