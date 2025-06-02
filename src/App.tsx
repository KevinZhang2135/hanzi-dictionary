import { ReactNode, useState } from 'react';
import './App.css';

import SearchTerm, { TermEntry } from './components/SearchTerm';

// Imports dictionary entries for Chinese characters and phrases and mappings
// for traditional and simplified characters
const dictEntries = await (
  await fetch('cedict_ts.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
).json();

const charMappings = await (
  await fetch('char_mappings.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
).json();

/**
 * Retrieves the dictionary entry for a specified term.
 * @param {string} term The specified character or phrase to retrieve the
 *   dictionary entry for
 * @returns The dictionary entry object for the specified term, or null if the
 *   term does not exist
 */
const getDictEntry = (term: string): string | null => {
  // Check if the term exists in the dictionary entries
  if (charMappings[term]) {
    return charMappings[term].map((index: number) => dictEntries[index]);
  }

  return null;
};

const App = (): ReactNode => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const enterSearchTerm = () => {
    const entry = getDictEntry(searchTerm);
    if (entry) {
      setSearchHistory([...entry]);
    }

    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && enterSearchTerm();
  };

  return (
    <div className="*:px-4 *:py-2 *:first:pt-0 *:last:pb-0">
      <div className="px-4 block">
        <h1 className="text-3xl text-gray-100 font-medium">
          Chinese English Dictionary
        </h1>
      </div>

      <p className="flex-grow text-gray-200">
        Dictionary that looks up Pinyin and English definition of Chinese
        characters and phrases.
      </p>

      {/* Search History and Definitions */}
      <div className="flex-grow">
        {searchHistory.map((termEntry, index) => {
          return (
            <div key={`search-history-${index}`}>
              <SearchTerm termEntry={termEntry as unknown as TermEntry} />
            </div>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="flex sticky bottom-4">
        <input
          id="character-input"
          className="mr-4 px-4 py-3 bg-gray-100 text-gray-950 flex-1 rounded-lg
                placeholder:text-gray-800 placeholder:italic  
                transition-colors duration-200"
          type="text"
          value={searchTerm}
          placeholder="Enter a Chinese character or phrase"
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <button
          className="px-4 py-3 bg-rose-500 text-gray-950 font-medium rounded-lg 
                transition-color duration-200 hover:bg-rose-400"
          onClick={() => enterSearchTerm()}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default App;
