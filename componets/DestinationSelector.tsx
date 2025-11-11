import React from 'react';

interface DestinationSelectorProps {
  destinations: string[];
  selectedDestination: string | null;
  onSelectDestination: (destination: string) => void;
  isLoading: boolean;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({ destinations, selectedDestination, onSelectDestination, isLoading }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      {destinations.map((destination) => (
        <button
          key={destination}
          onClick={() => onSelectDestination(destination)}
          disabled={isLoading}
          className={`px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isLoading ? 'cursor-not-allowed bg-gray-600 text-gray-400' : 'hover:scale-105'}
            ${selectedDestination === destination
              ? 'bg-teal-500 text-white shadow-lg ring-2 ring-teal-300'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
        >
          {destination}
        </button>
      ))}
    </div>
  );
};
