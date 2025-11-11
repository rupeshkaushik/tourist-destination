import React, { useState } from 'react';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

interface LocationInputProps {
  onExplore: (location: string) => void;
  isLoading: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({ onExplore, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onExplore(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto my-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="Enter a destination, e.g., 'Kyoto, Japan'"
          className="w-full pl-4 pr-24 py-3 bg-gray-700 text-white rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
          aria-label="Destination Input"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute inset-y-0 right-0 flex items-center px-6 m-1.5 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-teal-500"
        >
            {isLoading ? '...' : <><SearchIcon /><span className="ml-2 hidden sm:inline">Explore</span></>}
        </button>
      </div>
    </form>
  );
};
