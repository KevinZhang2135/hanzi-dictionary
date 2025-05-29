import { ReactNode, useState } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const enterSearchTerm = () => {
    setSearchHistory(searchHistory.concat(searchTerm));
    setSearchTerm('');
  };

  return (
    <>
      <div className="mb-2 p-2 block">
        <h1 className="text-xl text-gray-100 font-medium">
          Chinese English Dictionary
        </h1>
      </div>

      <main className="p-2 block flex flex-col">
        <p className="flex-grow mb-2 text-gray-200">
          Dictionary that looks up Pinyin and English definition of Chinese
          characters and phrases.
        </p>

        {/* Search History and Definitions */}
        <div className="flex-grow">
          {searchHistory.map(
            (term: string, index: number): ReactNode | null => {
              return <p key={`${term} ${index}`}>{term}</p>;
            }
          )}
        </div>

        {/* Search Input */}
        <div className="flex">
          <input
            id="character-input"
            className="mr-2 px-4 py-2 bg-gray-100 text-gray-950 flex-1 rounded-lg
                placeholder:text-gray-800 placeholder:italic  
                transition-colors duration-200"
            type="text"
            value={searchTerm}
            placeholder="Enter a Chinese character or phrase"
            onChange={(e) => {
              e.target.value && setSearchTerm(e.target.value);
            }}
          />

          <button
            className="px-4 py-2 bg-rose-500 text-gray-950 font-medium rounded-lg 
                transition-color duration-200 hover:bg-rose-400"
            onClick={() => enterSearchTerm()}
            onKeyDown={(e) => {
              e.key === 'Enter' && enterSearchTerm();
            }}
          >
            Search
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
