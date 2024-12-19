import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface ConversationSearchProps {
  onSearch: (query: string) => void;
}

const ConversationSearch: React.FC<ConversationSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4 px-2 sm:px-0">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar..."
          className="w-full px-3 py-2 pl-9 pr-3 text-sm sm:text-base text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
          <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default ConversationSearch;
