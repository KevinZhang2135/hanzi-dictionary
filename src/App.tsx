import { ReactNode, useState } from 'react';
import './App.css';

import SearchTerm, { TermEntry } from './components/SearchTerm';

// Imports dictionary entries for Chinese characters and phrases and mappings
// for traditional and simplified characters
const dictEntries = await (
  await fetch('cedict-ts.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
).json();

const charMappings = await (
  await fetch('char-mappings.json', {
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
    <div className="*:py-2 *:first:pt-0 *:last:pb-0">
      <div className="">
        <h1 className="text-3xl text-zinc-100 font-medium">
          Chinese English Dictionary
        </h1>
      </div>

      <p className="text-zinc-200">
        Dictionary that looks up Pinyin and English definition of Chinese
        characters and phrases.
      </p>

      {/* Search History and Definitions */}
      {searchHistory.length > 0 && (
        <div>
          {searchHistory.map((termEntry, index) => {
            return (
              <div key={`search-history-${index}`}>
                <SearchTerm termEntry={termEntry as unknown as TermEntry} />
              </div>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div className="flex sticky bottom-8">
        <input
          id="character-input"
          className="mr-4 px-4 py-3 bg-zinc-100 text-zinc-950 flex-1 rounded-lg
                placeholder:text-zinc-700 placeholder:italic"
          type="text"
          value={searchTerm}
          placeholder="Enter a Chinese character or phrase"
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <button
          className="px-4 py-3 bg-rose-500 text-zinc-950 font-medium rounded-lg cursor-pointer 
                transition-color duration-300 active:bg-rose-600"
          onClick={() => enterSearchTerm()}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default App;
