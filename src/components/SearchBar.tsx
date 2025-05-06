import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search articles...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center w-full"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:border-gray-600 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5 text-gray-400 dark:text-gray-500"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
          />
        </svg>
      </div>
      <button 
        type="submit" 
        className="absolute inset-y-0 right-0 flex items-center px-3 
                  text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400"
      >
        <span className="sr-only">Search</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" 
          />
        </svg>
      </button>
    </form>
  );
} 